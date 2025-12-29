# Migration Scripts

## Encrypt Existing Metadata

This script encrypts all existing file and folder names in the database.

### When to Use

Run this script **once** after deploying the metadata encryption feature to encrypt existing unencrypted data.

### Prerequisites

1. Metadata encryption code is deployed
2. `ENCRYPTION_KEY` is set in `.env`
3. Database is accessible

### How to Run

```bash
cd backend
npx ts-node scripts/encrypt-existing-metadata.ts
```

### What It Does

1. Fetches all users from the database
2. For each user:
   - Derives their encryption key from their Telegram session
   - Finds all their files and folders
   - Encrypts the names (skips already encrypted ones)
   - Updates the database

### Safety Features

- ✅ Idempotent: Safe to run multiple times (skips already encrypted data)
- ✅ Per-user encryption: Each user's data encrypted with their own key
- ✅ Backward compatible: Doesn't break existing functionality

### Example Output

```
🔐 Starting metadata encryption migration...

Found 3 users

👤 Processing user: John Doe (abc-123)
  📁 Found 5 folders
  ✅ Encrypted folder: "Documents" → [encrypted]
  ✅ Encrypted folder: "Photos" → [encrypted]
  📄 Found 12 files
  ✅ Encrypted file: "resume.pdf" → [encrypted]
  ✅ Encrypted file: "vacation.jpg" → [encrypted]
  ...

============================================================
✨ Migration complete!

📊 Summary:
  Total folders: 15
  Encrypted folders: 15
  Skipped folders: 0
  Total files: 47
  Encrypted files: 47
  Skipped files: 0
============================================================
```

### Rollback

If you need to rollback (decrypt everything):

**⚠️ WARNING:** There is no automated rollback script. If you need to decrypt, you would need to:
1. Restore from a database backup taken before running this script
2. Or manually decrypt using the same keys (not recommended)

**Recommendation:** Take a database backup before running this script.

### Backup Command (PostgreSQL)

```bash
# Backup before migration
pg_dump $DATABASE_URL > backup-before-encryption-$(date +%Y%m%d).sql

# Restore if needed
psql $DATABASE_URL < backup-before-encryption-YYYYMMDD.sql
```
