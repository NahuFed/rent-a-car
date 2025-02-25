// filepath: /src/email/email.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue', 
    }),
  ],
  providers: [EmailProcessor, EmailService],
  exports: [BullModule],
})
export class EmailModule {}