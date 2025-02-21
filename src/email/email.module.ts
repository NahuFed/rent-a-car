// filepath: /src/email/email.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue', // Asegúrate de que el nombre coincide
    }),
  ],
  providers: [EmailProcessor, EmailService],
  exports: [BullModule], // Exporta BullModule para que la cola se pueda inyectar en otros módulos
})
export class EmailModule {}