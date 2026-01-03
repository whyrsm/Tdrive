import { PrismaClient } from '@prisma/client';
import { CryptoService } from '../src/common/services/crypto.service';
import { ConfigService } from '@nestjs/config';

// Mock ConfigService to provide environment variables to CryptoService
class MockConfigService extends ConfigService {
    constructor(private env: NodeJS.ProcessEnv) {
        super();
    }

    get<T = any>(key: string): T {
        return this.env[key] as unknown as T;
    }
}

/**
 * Migration script to re-encrypt session strings with AES-256-GCM.
 * 
 * This script:
 * 1. Iterates over all users.
 * 2. Decrypts the session string using CryptoService (which supports legacy CBC).
 * 3. Re-encrypts it using CryptoService (which uses GCM by default).
 * 4. Updates the database.
 * 
 * Run with: npx ts-node scripts/encrypt-session-strings.ts
 */

const prisma = new PrismaClient();
const configService = new MockConfigService(process.env);
const cryptoService = new CryptoService(configService);

async function main() {
    console.log('🔐 Starting session string encryption migration...\n');

    if (!process.env.ENCRYPTION_KEY) {
        console.error('❌ ENCRYPTION_KEY environment variable is missing!');
        process.exit(1);
    }

    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of users) {
        console.log(`👤 Processing user: ${user.firstName || 'Unknown'} (${user.id})`);

        try {
            const currentSession = user.sessionString;

            // Decrypt (CryptoService handles both GCM and Legacy CBC)
            const decrypted = cryptoService.decryptSession(currentSession);

            if (!decrypted) {
                console.warn(`  ⚠️ Could not decrypt session for user ${user.id}. Skipping.`);
                errorCount++;
                continue;
            }

            // Re-encrypt (CryptoService encrypts with GCM)
            const reEncrypted = cryptoService.encryptSession(decrypted);

            // Check if it actually changed (if it was already GCM, it might change due to new IV, but we want to know if we upgraded format)
            // We can check format.
            const isAlreadyGCM = currentSession.split(':').length === 3;

            if (isAlreadyGCM && cryptoService.decryptSession(reEncrypted) === decrypted) {
                // Optimization: If it's already GCM and works, we *could* skip.
                // But re-encrypting rotates the IV which is fine.
                // Let's just update to be sure.
            }

            if (currentSession === reEncrypted) {
                console.log('  ⏭️  Session string identical (unlikely with random IV). Skipping update.');
                skippedCount++;
                continue;
            }

            await prisma.user.update({
                where: { id: user.id },
                data: { sessionString: reEncrypted },
            });

            const oldFormat = currentSession.split(':').length === 2 ? 'CBC' : (currentSession.split(':').length === 3 ? 'GCM' : 'Unknown');
            console.log(`  ✅ Updated session: ${oldFormat} -> GCM`);
            updatedCount++;

        } catch (error) {
            console.error(`  ❌ Error processing user ${user.id}:`, error);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Migration complete!\n');
    console.log(`📊 Summary:`);
    console.log(`  Total users: ${users.length}`);
    console.log(`  Updated users: ${updatedCount}`);
    console.log(`  Skipped users: ${skippedCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log('='.repeat(60));
}

main()
    .catch((error) => {
        console.error('\n❌ Error during migration:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
