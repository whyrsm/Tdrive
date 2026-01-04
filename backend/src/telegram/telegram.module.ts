import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule { }
