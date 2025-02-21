import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // 🔹 Cambiá esto si usás otro proveedor
      auth: {
        user: process.env.EMAIL_USER, // 📌 Agregá esto en el .env
        pass: process.env.EMAIL_PASS, // 📌 Agregá esto en el .env
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: `"Car Rental" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      });

      console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
      console.error(`❌ Error sending email to ${to}:`, error);
    }
  }
}
