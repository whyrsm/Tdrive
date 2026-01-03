import { PrismaClient } from '@prisma/client';
import { CryptoService } from '../src/common/services/crypto.service';
import { createHash } from 'crypto';

/**
 * Migration script to encrypt existing file and folder names.
 * 
 * This script:
 * 1. Fetches all users
 * 2. For each user, derives their encryption key from their session
 * 3. Encrypts all their file and folder names
 * 4. Updates the database
 * 
 * Run with: npx ts-node scripts/encrypt-existing-metadata.ts
 */

const prisma = new PrismaClient();

// Mock ConfigService to satisfy dependency and read from process.env
const configService = {
  get: (key: string) => process.env[key],
} as any;

const cryptoService = new CryptoService(configService);

async function main() {
  console.log('🔐 Starting metadata encryption migration...\n');

  // Get all users
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users\n`);

  let totalFiles = 0;
  let totalFolders = 0;
  let encryptedFiles = 0;
  let encryptedFolders = 0;

  for (const user of users) {
    console.log(`\n👤 Processing user: ${user.firstName || 'Unknown'} (${user.id})`);

    // Derive encryption key from user's session
    const userKey = cryptoService.deriveKeyFromSession(user.sessionString);

    // Encrypt folders
    const folders = await prisma.folder.findMany({
      where: { userId: user.id },
    });

    console.log(`  📁 Found ${folders.length} folders`);
    totalFolders += folders.length;

    for (const folder of folders) {
      // Check if already encrypted
      if (cryptoService.isEncrypted(folder.name)) {
        console.log(`  ⏭️  Skipping already encrypted folder: ${folder.id}`);
        continue;
      }

      const encryptedName = cryptoService.encryptMetadata(folder.name, userKey);
      await prisma.folder.update({
        where: { id: folder.id },
        data: { name: encryptedName },
      });

      encryptedFolders++;
      console.log(`  ✅ Encrypted folder: "${folder.name}" → [encrypted]`);
    }

    // Encrypt files
    const files = await prisma.file.findMany({
      where: { userId: user.id },
    });

    console.log(`  📄 Found ${files.length} files`);
    totalFiles += files.length;

    for (const file of files) {
      // Check if already encrypted
      if (cryptoService.isEncrypted(file.name)) {
        console.log(`  ⏭️  Skipping already encrypted file: ${file.id}`);
        continue;
      }

      const encryptedName = cryptoService.encryptMetadata(file.name, userKey);
      await prisma.file.update({
        where: { id: file.id },
        data: { name: encryptedName },
      });

      encryptedFiles++;
      console.log(`  ✅ Encrypted file: "${file.name}" → [encrypted]`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Migration complete!\n');
  console.log(`📊 Summary:`);
  console.log(`  Total folders: ${totalFolders}`);
  console.log(`  Encrypted folders: ${encryptedFolders}`);
  console.log(`  Skipped folders: ${totalFolders - encryptedFolders}`);
  console.log(`  Total files: ${totalFiles}`);
  console.log(`  Encrypted files: ${encryptedFiles}`);
  console.log(`  Skipped files: ${totalFiles - encryptedFiles}`);
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
