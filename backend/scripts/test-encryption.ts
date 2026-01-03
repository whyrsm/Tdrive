import { CryptoService } from '../src/common/services/crypto.service';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes } from 'crypto';

class MockConfigService extends ConfigService {
    constructor(private key: string) { super(); }
    get<T>(key: string): T { return (key === 'ENCRYPTION_KEY' ? this.key : null) as T; }
}

const TEST_KEY = '12345678901234567890123456789012'; // 32 chars
const SESSION = '1ApWapzMBbu...some_long_session_string...';

async function test() {
    console.log('🧪 Testing Encryption Service upgrade...\n');

    const config = new MockConfigService(TEST_KEY);
    const crypto = new CryptoService(config);

    // 1. Test GCM Encryption (New way)
    console.log('1️⃣  Testing GCM Encryption (New Format)');
    const encryptedGCM = crypto.encryptSession(SESSION);
    console.log('   Encrypted:', encryptedGCM);
    const parts = encryptedGCM.split(':');

    if (parts.length !== 3) throw new Error('Expected 3 parts for GCM (iv:authTag:encrypted)');
    console.log('   ✅ Format check passed');

    const decryptedGCM = crypto.decryptSession(encryptedGCM);
    if (decryptedGCM !== SESSION) throw new Error('GCM Decryption failed!');
    console.log('   ✅ Decryption passed');

    // 2. Test CBC Decryption (Legacy way)
    console.log('\n2️⃣  Testing CBC Decryption (Legacy Format)');
    // Manually create a legacy CBC encrypted string
    const iv = randomBytes(16);
    const key = Buffer.from(TEST_KEY);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encryptedCBC = cipher.update(SESSION, 'utf8', 'hex');
    encryptedCBC += cipher.final('hex');
    const legacyString = iv.toString('hex') + ':' + encryptedCBC;

    console.log('   Legacy String:', legacyString);
    const decryptedLegacy = crypto.decryptSession(legacyString);
    if (decryptedLegacy !== SESSION) throw new Error('Legacy CBC Decryption failed!');
    console.log('   ✅ Legacy Fallback passed');

    // 3. Test Plaintext Fallback
    console.log('\n3️⃣  Testing Plaintext Fallback');
    const plaintext = 'PlaintextSessionString';
    const decryptedPlain = crypto.decryptSession(plaintext);
    if (decryptedPlain !== plaintext) throw new Error('Plaintext fallback failed!');
    console.log('   ✅ Plaintext Fallback passed');

    console.log('\n✨ All tests passed!');
}

test().catch(e => {
    console.error('❌ Test Failed:', e);
    process.exit(1);
});
