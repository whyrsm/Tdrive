import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

/**
 * CryptoService handles per-user metadata encryption.
 * 
 * Each user's metadata (filenames, folder names) is encrypted with a key
 * derived from their unique session string. This ensures that even with
 * full database access, developers cannot read user metadata.
 */
@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';

  /**
   * Derives a 32-byte encryption key from the user's session string.
   * The session string is unique per user, so each user gets a unique key.
   */
  deriveKeyFromSession(encryptedSessionString: string): Buffer {
    // Use SHA-256 to derive a consistent 32-byte key from the session
    return createHash('sha256').update(encryptedSessionString).digest();
  }

  /**
   * Encrypts metadata (filename, folder name) using the user's derived key.
   * Returns format: iv:authTag:encryptedData (all hex encoded)
   */
  encryptMetadata(plaintext: string, userKey: Buffer): string {
    const iv = randomBytes(12); // GCM recommends 12 bytes
    const cipher = createCipheriv(this.algorithm, userKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypts metadata using the user's derived key.
   */
  decryptMetadata(encryptedData: string, userKey: Buffer): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    if (!ivHex || !authTagHex || !encrypted) {
      // Return as-is if not in encrypted format (for backward compatibility)
      return encryptedData;
    }
    
    try {
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = createDecipheriv(this.algorithm, userKey, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch {
      // Return as-is if decryption fails (backward compatibility for unencrypted data)
      return encryptedData;
    }
  }

  /**
   * Checks if a string appears to be encrypted (has the expected format)
   */
  isEncrypted(value: string): boolean {
    const parts = value.split(':');
    return parts.length === 3 && parts[0].length === 24 && parts[1].length === 32;
  }
}
