# Session String Stability Fix

**Date**: 2026-01-04  
**Issue**: File and folder names couldn't be decrypted after user re-login

## Problem Description

After a user logged out and logged back in, all their file and folder names appeared as encrypted gibberish (long hexadecimal strings) instead of the original names.

### Root Cause

1. **Telegram Session Behavior**: Every time a user signs in to Telegram, the Telegram API generates a **new session string**, even for the same user.

2. **Encryption Key Derivation**: The application derives the encryption key for file/folder names from the user's session string using SHA-256:
   ```typescript
   deriveKeyFromSession(rawSessionString: string): Buffer {
     return createHash('sha256').update(rawSessionString).digest();
   }
   ```

3. **Session Update on Re-login**: The original code was updating the `session_string` in the database on **every login**:
   ```typescript
   update: {
     sessionString: encryptedSession,  // ❌ This was changing the key!
     firstName: user.firstName || null,
     lastName: user.lastName || null,
     phone,
   }
   ```

4. **Decryption Failure**: When the session string changed, the derived encryption key also changed, making it impossible to decrypt file/folder names that were encrypted with the old key.

## Solution

**Preserve the original session string for existing users.**

The `session_string` should only be set during **initial user creation**, not on subsequent logins. This ensures the encryption key remains stable throughout the user's lifetime.

### Code Changes

**File**: `backend/src/auth/auth.service.ts`

```typescript
const dbUser = await this.prisma.user.upsert({
  where: { telegramId: BigInt(user.id.toString()) },
  update: {
    // DO NOT update sessionString - keep the original to maintain encryption key stability
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    phone,
  },
  create: {
    telegramId: BigInt(user.id.toString()),
    sessionString: encryptedSession,  // ✅ Only set on creation
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    phone,
  },
});
```

## Impact

### Before Fix
- ❌ Re-login → New session string → New encryption key → Can't decrypt old files/folders
- ❌ All file and folder names appear as encrypted strings after re-login

### After Fix
- ✅ Re-login → Session string preserved → Same encryption key → Files/folders decrypt correctly
- ✅ File and folder names remain readable across login sessions
- ✅ Encryption key stability maintained for the lifetime of the user account

## Important Notes

1. **Session String Purpose**: The session string stored in the database serves **two purposes**:
   - As a stable seed for deriving the encryption key
   - As a backup for Telegram authentication (though a new session is created on each login)

2. **Security Implications**: 
   - The encryption key stability is **critical** for data accessibility
   - Users cannot decrypt their data if the session string changes
   - This is by design - it ensures end-to-end encryption where only the user can access their data

3. **Migration**: Users who have already experienced this issue will need to:
   - Their old session string should be restored from a backup, OR
   - They will need to re-import their files (which will be encrypted with the current session string)

## Testing

To verify the fix:

1. Login as a user
2. Upload files and create folders
3. Verify names are visible
4. Logout
5. Login again
6. Verify file and folder names are still correctly displayed (not encrypted strings)

## Related Files

- `backend/src/auth/auth.service.ts` - Authentication logic (FIXED)
- `backend/src/common/services/crypto.service.ts` - Encryption/decryption logic
- `backend/src/telegram/telegram.service.ts` - Telegram session management
- `docs/20260104_encryption_mechanism.md` - Encryption mechanism documentation
