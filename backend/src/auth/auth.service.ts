import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { TelegramClient } from 'telegram';
import { AUTH } from '../common/constants';

interface PendingAuth {
  client: TelegramClient;
  phoneCodeHash: string;
  phone: string;
}

@Injectable()
export class AuthService {
  private pendingAuths = new Map<string, PendingAuth>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private telegramService: TelegramService,
  ) {}

  async sendCode(phone: string): Promise<{ tempToken: string }> {
    const client = await this.telegramService.createClient();
    const { phoneCodeHash } = await this.telegramService.sendCode(client, phone);
    
    const tempToken = this.jwtService.sign({ phone }, { expiresIn: AUTH.CODE_EXPIRY });
    this.pendingAuths.set(tempToken, { client, phoneCodeHash, phone });
    
    return { tempToken };
  }

  async verifyCode(tempToken: string, code: string): Promise<{ accessToken: string }> {
    const pending = this.pendingAuths.get(tempToken);
    if (!pending) {
      throw new UnauthorizedException('Invalid or expired verification session');
    }

    const { client, phoneCodeHash, phone } = pending;
    
    try {
      const { user, sessionString } = await this.telegramService.signIn(
        client,
        phone,
        code,
        phoneCodeHash,
      );

      const encryptedSession = this.telegramService.encryptSession(sessionString);
      
      const dbUser = await this.prisma.user.upsert({
        where: { telegramId: BigInt(user.id.toString()) },
        update: {
          sessionString: encryptedSession,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          phone,
        },
        create: {
          telegramId: BigInt(user.id.toString()),
          sessionString: encryptedSession,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          phone,
        },
      });

      this.pendingAuths.delete(tempToken);
      await client.disconnect();

      const accessToken = this.jwtService.sign({ sub: dbUser.id });
      return { accessToken };
    } catch (error: any) {
      // Map Telegram API errors to user-friendly messages
      const errorMessage = error.errorMessage || error.message || 'Unknown error';
      
      if (errorMessage === 'PHONE_CODE_INVALID') {
        throw new UnauthorizedException('Invalid verification code. Please check and try again');
      }
      if (errorMessage === 'PHONE_CODE_EXPIRED') {
        this.pendingAuths.delete(tempToken);
        throw new UnauthorizedException('Verification code has expired. Please request a new code');
      }
      if (errorMessage === 'PHONE_CODE_EMPTY') {
        throw new UnauthorizedException('Please enter the verification code');
      }
      if (errorMessage === 'SESSION_PASSWORD_NEEDED') {
        throw new UnauthorizedException('Two-factor authentication is enabled. Please disable it in Telegram settings and try again');
      }
      
      console.error('Telegram signIn error:', error);
      throw new UnauthorizedException('Invalid verification code');
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async getClientForUser(userId: string): Promise<TelegramClient> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const sessionString = this.telegramService.decryptSession(user.sessionString);
    return this.telegramService.createClient(sessionString);
  }
}
