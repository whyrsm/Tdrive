import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../src/common/services/crypto.service';

const prisma = new PrismaClient();

interface EncryptionStats {
    total: number;
    newGCM: number;
    legacyCBC: number;
    plaintext: number;
    invalid: number;
}

interface AssessmentReport {
    sessionStrings: EncryptionStats;
    folderNames: EncryptionStats;
    fileNames: EncryptionStats;
    userDetails: Array<{
        userId: string;
        telegramId: string;
        sessionFormat: 'GCM' | 'CBC' | 'Plaintext' | 'Invalid';
        encryptedFolders: number;
        plaintextFolders: number;
        encryptedFiles: number;
        plaintextFiles: number;
    }>;
}

/**
 * Determines the encryption format of a value
 */
function detectEncryptionFormat(value: string): 'GCM' | 'CBC' | 'Plaintext' | 'Invalid' {
    if (!value) return 'Invalid';

    const parts = value.split(':');

    // GCM format: iv:authTag:encrypted (iv=12 bytes=24 hex, authTag=16 bytes=32 hex)
    if (parts.length === 3) {
        const [ivHex, authTagHex, encrypted] = parts;
        if (ivHex.length === 24 && authTagHex.length === 32 && encrypted.length > 0) {
            return 'GCM';
        }
    }

    // Legacy CBC format: iv:encrypted (iv=16 bytes=32 hex)
    if (parts.length === 2) {
        const [ivHex, encrypted] = parts;
        if (ivHex.length === 32 && encrypted.length > 0) {
            return 'CBC';
        }
    }

    // Check if it looks like it might be encrypted but malformed
    if (parts.length > 1) {
        return 'Invalid';
    }

    // Otherwise it's plaintext
    return 'Plaintext';
}

/**
 * Updates stats based on detected format
 */
function updateStats(stats: EncryptionStats, format: 'GCM' | 'CBC' | 'Plaintext' | 'Invalid') {
    stats.total++;
    switch (format) {
        case 'GCM':
            stats.newGCM++;
            break;
        case 'CBC':
            stats.legacyCBC++;
            break;
        case 'Plaintext':
            stats.plaintext++;
            break;
        case 'Invalid':
            stats.invalid++;
            break;
    }
}

/**
 * Creates an empty stats object
 */
function createEmptyStats(): EncryptionStats {
    return {
        total: 0,
        newGCM: 0,
        legacyCBC: 0,
        plaintext: 0,
        invalid: 0,
    };
}

/**
 * Formats stats for display
 */
function formatStats(stats: EncryptionStats, label: string): string {
    const lines = [
        `\n${label}:`,
        `  Total: ${stats.total}`,
        `  ✅ New GCM Format: ${stats.newGCM} (${((stats.newGCM / stats.total) * 100).toFixed(1)}%)`,
        `  ⚠️  Legacy CBC Format: ${stats.legacyCBC} (${((stats.legacyCBC / stats.total) * 100).toFixed(1)}%)`,
        `  📝 Plaintext: ${stats.plaintext} (${((stats.plaintext / stats.total) * 100).toFixed(1)}%)`,
    ];

    if (stats.invalid > 0) {
        lines.push(`  ❌ Invalid/Corrupted: ${stats.invalid} (${((stats.invalid / stats.total) * 100).toFixed(1)}%)`);
    }

    return lines.join('\n');
}

async function assessEncryptionStatus() {
    console.log('🔍 Starting encryption status assessment...\n');

    const report: AssessmentReport = {
        sessionStrings: createEmptyStats(),
        folderNames: createEmptyStats(),
        fileNames: createEmptyStats(),
        userDetails: [],
    };

    try {
        // Assess all users
        const users = await prisma.user.findMany({
            include: {
                folders: true,
                files: true,
            },
        });

        console.log(`Found ${users.length} users to assess\n`);

        for (const user of users) {
            // Assess session string
            const sessionFormat = detectEncryptionFormat(user.sessionString);
            updateStats(report.sessionStrings, sessionFormat);

            // Assess folders
            let encryptedFolders = 0;
            let plaintextFolders = 0;

            for (const folder of user.folders) {
                const folderFormat = detectEncryptionFormat(folder.name);
                updateStats(report.folderNames, folderFormat);

                if (folderFormat === 'GCM') {
                    encryptedFolders++;
                } else if (folderFormat === 'Plaintext') {
                    plaintextFolders++;
                }
            }

            // Assess files
            let encryptedFiles = 0;
            let plaintextFiles = 0;

            for (const file of user.files) {
                const fileFormat = detectEncryptionFormat(file.name);
                updateStats(report.fileNames, fileFormat);

                if (fileFormat === 'GCM') {
                    encryptedFiles++;
                } else if (fileFormat === 'Plaintext') {
                    plaintextFiles++;
                }
            }

            // Add user details to report
            report.userDetails.push({
                userId: user.id,
                telegramId: user.telegramId.toString(),
                sessionFormat,
                encryptedFolders,
                plaintextFolders,
                encryptedFiles,
                plaintextFiles,
            });
        }

        // Print summary
        console.log('═══════════════════════════════════════════════════════════');
        console.log('                  ENCRYPTION STATUS REPORT                  ');
        console.log('═══════════════════════════════════════════════════════════');

        console.log(formatStats(report.sessionStrings, '📱 SESSION STRINGS'));
        console.log(formatStats(report.folderNames, '📁 FOLDER NAMES'));
        console.log(formatStats(report.fileNames, '📄 FILE NAMES'));

        // Print detailed user breakdown
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('                    PER-USER BREAKDOWN                      ');
        console.log('═══════════════════════════════════════════════════════════\n');

        for (const userDetail of report.userDetails) {
            console.log(`User: ${userDetail.telegramId} (${userDetail.userId})`);
            console.log(`  Session: ${userDetail.sessionFormat}`);
            console.log(`  Folders: ${userDetail.encryptedFolders} encrypted, ${userDetail.plaintextFolders} plaintext`);
            console.log(`  Files: ${userDetail.encryptedFiles} encrypted, ${userDetail.plaintextFiles} plaintext`);
            console.log('');
        }

        // Print recommendations
        console.log('═══════════════════════════════════════════════════════════');
        console.log('                     RECOMMENDATIONS                        ');
        console.log('═══════════════════════════════════════════════════════════\n');

        const hasLegacySessions = report.sessionStrings.legacyCBC > 0;
        const hasPlaintextSessions = report.sessionStrings.plaintext > 0;
        const hasLegacyMetadata = report.folderNames.legacyCBC > 0 || report.fileNames.legacyCBC > 0;
        const hasPlaintextMetadata = report.folderNames.plaintext > 0 || report.fileNames.plaintext > 0;

        if (hasLegacySessions) {
            console.log('⚠️  LEGACY SESSION ENCRYPTION DETECTED');
            console.log(`   ${report.sessionStrings.legacyCBC} session(s) using old CBC format`);
            console.log('   → Consider migrating to GCM format for better security\n');
        }

        if (hasPlaintextSessions) {
            console.log('❌ PLAINTEXT SESSIONS DETECTED');
            console.log(`   ${report.sessionStrings.plaintext} session(s) are not encrypted`);
            console.log('   → URGENT: Encrypt these sessions immediately!\n');
        }

        if (hasPlaintextMetadata) {
            console.log('❌ PLAINTEXT METADATA DETECTED');
            console.log(`   ${report.folderNames.plaintext} folder name(s) are not encrypted`);
            console.log(`   ${report.fileNames.plaintext} file name(s) are not encrypted`);
            console.log('   → URGENT: Encrypt this metadata for privacy!\n');
        }

        if (hasLegacyMetadata) {
            console.log('⚠️  LEGACY METADATA ENCRYPTION DETECTED');
            console.log(`   ${report.folderNames.legacyCBC} folder name(s) using old CBC format`);
            console.log(`   ${report.fileNames.legacyCBC} file name(s) using old CBC format`);
            console.log('   → Consider migrating to GCM format\n');
        }

        if (!hasLegacySessions && !hasPlaintextSessions && !hasLegacyMetadata && !hasPlaintextMetadata) {
            console.log('✅ ALL DATA IS USING CURRENT GCM ENCRYPTION');
            console.log('   No migration needed!\n');
        }

        console.log('═══════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error during assessment:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the assessment
assessEncryptionStatus()
    .then(() => {
        console.log('✅ Assessment complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Assessment failed:', error);
        process.exit(1);
    });
