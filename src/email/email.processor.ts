import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';

@Processor('email-queue')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('sendEmail')
  async handleSendEmail(job: Job<{ to: string; subject: string; text: string }>) {
    const { to, subject, text } = job.data;
    console.log(`📧 Processing email to ${to} - Subject: ${subject}`);

    await this.emailService.sendEmail(to, subject, text);

    console.log(`✅ Email successfully sent to ${to}`);
  }
}
