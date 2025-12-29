# Metadata Encryption

## Overview

TDrive encrypts file and folder names to protect user privacy. Each user's metadata is encrypted with their own unique encryption key derived from their Telegram session.

**What this protects against:**
- ✅ Database breaches (hackers need both DB access AND the encryption key)
- ✅ Accidental data exposure in logs, backups, or error messages
- ✅ Unauthorized database access by third parties
- ✅ Per-user isolation (users can't see each other's filenames)

**Transparency:** As the server operator with full access, you can technically decrypt metadata if needed for legitimate purposes (debugging, legal compliance). This is standard for server-side encryption used by most cloud services.

## How It Works (Simple Explanation)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER UPLOADS FILE                        │
│                        "vacation-photo.jpg"                      │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ENCRYPTION PROCESS                            │
│                                                                  │
│   User's Telegram Session ──► Derive Unique Key ──► Encrypt     │
│   (only user has this)        (SHA-256 hash)        (AES-256)   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STORED IN DATABASE                          │
│           "a1b2c3:d4e5f6:7g8h9i0j1k2l3m4n5o6p7q8r9"            │
│                    (unreadable gibberish)                        │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WHEN USER VIEWS FILES                         │
│                                                                  │
│   Encrypted name ──► User's Key ──► Decrypt ──► "vacation-photo.jpg"
└─────────────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. What is a Telegram Session String?

When a user first logs in with their phone number and SMS code, Telegram returns a **session string** — a long authentication token like `1BQANOTEuMTA4LjE1NC4...`.

**Important:** This is NOT a random string that changes every login. It's a **persistent token** that stays the same as long as the user doesn't log out from Telegram.

```
First Login:
  Phone + SMS Code → Telegram → Session String "ABC123..."
                                      ↓
                              Saved in Database
                                      ↓
                              Used for encryption key

Next Login (days/months later):
  JWT Token → Look up user → Same Session String "ABC123..."
                                      ↓
                              Same encryption key!
                                      ↓
                              Can decrypt all files ✓
```

### 2. Per-User Encryption Key

Each user has a unique encryption key derived from their Telegram session:

```
User A's session "ABC123..." → Key A → Can only decrypt User A's files
User B's session "XYZ789..." → Key B → Can only decrypt User B's files
```

The developer doesn't have access to user sessions (they're encrypted in the database), so they can't decrypt anyone's filenames.

### 2. What Gets Encrypted

| Data | Encrypted? | Why |
|------|------------|-----|
| File names | ✅ Yes | Privacy |
| Folder names | ✅ Yes | Privacy |
| File content | ❌ No | Stored in Telegram (already encrypted by Telegram) |
| File size | ❌ No | Needed for storage calculations |
| MIME type | ❌ No | Needed for file previews |

### 3. Encryption Algorithm

- **Algorithm**: AES-256-GCM (military-grade encryption)
- **Key derivation**: SHA-256 hash of user's session string
- **Random IV**: Each encryption uses a random initialization vector

## What the Developer Sees

When looking at the database:

```sql
SELECT name FROM files WHERE user_id = 'user-123';

-- Result:
-- a1b2c3d4e5f6:g7h8i9j0k1l2:m3n4o5p6q7r8s9t0u1v2w3x4y5z6
-- b2c3d4e5f6g7:h8i9j0k1l2m3:n4o5p6q7r8s9t0u1v2w3x4y5z6a7
```

The developer sees encrypted strings, not actual filenames like "tax-returns-2024.pdf" or "private-photos".

## What the User Sees

The user sees their normal filenames because the app decrypts them using their session:

```
📁 My Documents
📁 Photos
📄 vacation-photo.jpg
📄 resume.pdf
```

## Trade-offs

### Pros
- ✅ Developer cannot read user filenames
- ✅ Database breach doesn't expose file names
- ✅ Each user has isolated encryption

### Cons
- ⚠️ Search happens client-side (slightly slower for large file counts)
- ⚠️ Cannot sort alphabetically in database
- ⚠️ If user loses Telegram session, filenames become unrecoverable

## Technical Details

### Encryption Format

Encrypted strings have 3 parts separated by colons:

```
[IV]:[Auth Tag]:[Encrypted Data]
 │       │            │
 │       │            └── The actual encrypted filename
 │       └── Verification tag (ensures data wasn't tampered)
 └── Random initialization vector (makes each encryption unique)
```

### Code Location

- `backend/src/common/services/crypto.service.ts` - Encryption/decryption logic
- `backend/src/files/files.service.ts` - File name encryption
- `backend/src/folders/folders.service.ts` - Folder name encryption

## FAQ

**Q: What happens to existing unencrypted files?**
A: They continue to work. The system detects unencrypted names and displays them as-is (backward compatible). To encrypt existing data, run the migration script:
```bash
cd backend
npm run migrate:encrypt-metadata
```
See `backend/scripts/README.md` for details.

**Q: Does the session string change every time I login?**
A: No! The session string is created once when you first verify your phone number. It's saved in the database and reused for all future logins. It only changes if you explicitly log out from Telegram or your Telegram account is terminated.

**Q: Can the developer decrypt filenames if they really wanted to?**
A: Yes, with full server access (database + ENCRYPTION_KEY environment variable). This is standard for server-side encryption. The encryption primarily protects against database breaches, unauthorized access, and accidental exposure. For true zero-knowledge encryption where even the server operator cannot decrypt, client-side encryption would be needed (with trade-offs like no password recovery).

**Q: What happens to existing unencrypted files?**
A: They continue to work. The system detects unencrypted names and displays them as-is (backward compatible).

**Q: Is the file content also encrypted?**
A: File content is stored in Telegram's Saved Messages, which uses Telegram's own encryption. TDrive only stores metadata in its database.

**Q: What if I log out from Telegram and log back in?**
A: You'll get a NEW session string, which means a NEW encryption key. Your old encrypted filenames will become unreadable (they'll show as encrypted gibberish). This is a trade-off for privacy — there's no "master key" that can decrypt everything.
