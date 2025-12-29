# Metadata Encryption Migration Guide

## Overview

This guide walks you through encrypting existing file and folder names in your TDrive database.

## Before You Start

### 1. Backup Your Database

**CRITICAL:** Always backup before running migrations.

```bash
# For PostgreSQL (Railway, Heroku, etc.)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Or use your hosting provider's backup feature
```

### 2. Verify Prerequisites

- ✅ Metadata encryption code is deployed
- ✅ `ENCRYPTION_KEY` exists in `.env`
- ✅ Database is accessible
- ✅ No users are actively uploading files (optional, but recommended)

## Running the Migration

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Run the Migration Script

```bash
npm run migrate:encrypt-metadata
```

### Step 3: Monitor the Output

You'll see progress for each user:

```
🔐 Starting metadata encryption migration...

Found 3 users

👤 Processing user: John Doe (abc-123)
  📁 Found 5 folders
  ✅ Encrypted folder: "Documents" → [encrypted]
  ✅ Encrypted folder: "Photos" → [encrypted]
  📄 Found 12 files
  ✅ Encrypted file: "resume.pdf" → [encrypted]
  ...
```

### Step 4: Verify Success

Check the summary at the end:

```
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

## After Migration

### Verify in the App

1. Log in as a test user
2. Navigate to your files
3. Filenames should display normally (decrypted automatically)

### Check the Database

```bash
npm run prisma:studio
```

Look at the `files` and `folders` tables — the `name` column should show encrypted strings like:
```
a1b2c3d4e5f6:g7h8i9j0k1l2:m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## Troubleshooting

### Error: "Cannot find module"

Install dependencies:
```bash
npm install
```

### Error: "Database connection failed"

Check your `DATABASE_URL` in `.env`:
```bash
echo $DATABASE_URL
```

### Files Show as Encrypted Gibberish in App

This means decryption is failing. Check:
1. `ENCRYPTION_KEY` in `.env` matches what was used during migration
2. User's session string hasn't changed
3. Backend code is properly deployed

### Need to Rollback

Restore from backup:
```bash
psql $DATABASE_URL < backup-YYYYMMDD-HHMMSS.sql
```

## Running Multiple Times

The script is **idempotent** — safe to run multiple times. It will:
- Skip already encrypted files/folders
- Only encrypt new unencrypted data

## Production Deployment Checklist

- [ ] Backup database
- [ ] Deploy encryption code to production
- [ ] Verify `ENCRYPTION_KEY` is set
- [ ] Run migration script
- [ ] Test with a user account
- [ ] Monitor for errors
- [ ] Keep backup for 7+ days

## Questions?

See `docs/20251229_metadata_encryption.md` for technical details about how encryption works.
