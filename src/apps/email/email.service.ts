import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface WelcomeEmailData {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
}

export interface PasswordResetEmailData {
  name: string;
  email: string;
  resetUrl: string;
  resetToken: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      this.logger.log(`Sending welcome email to ${data.email}`);

      await this.mailerService.sendMail({
        to: data.email,
        subject:
          'Boas vindas à plataforma de Estimativa de população Canina e Felina',
        template: 'welcome',
        context: {
          name: data.name,
          email: data.email,
          password: data.password,
          loginUrl: data.loginUrl,
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(`Welcome email sent successfully to ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${data.email}:`,
        error,
      );
      throw new Error(`Email sending failed: ${error}`);
    }
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    try {
      this.logger.log(`Sending password reset email to ${data.email}`);

      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Recuperação de Senha - Pet Research',
        template: 'password-reset',
        context: {
          name: data.name,
          email: data.email,
          resetUrl: data.resetUrl,
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Password reset email sent successfully to ${data.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${data.email}:`,
        error,
      );
      throw new Error(`Email sending failed: ${error}`);
    }
  }

  async sendPlainEmail(
    to: string,
    subject: string,
    content: string,
  ): Promise<void> {
    try {
      this.logger.log(`Sending plain email to ${to}`);

      await this.mailerService.sendMail({
        to,
        subject,
        text: content,
      });

      this.logger.log(`Plain email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send plain email to ${to}:`, error);
      throw new Error(`Email sending failed: ${error}`);
    }
  }
}
