
import nodemailer from 'nodemailer';
import { getEmailConfig, shouldFailOnEmailError } from './config';
import { generateSenderEmailHTML, generateRecipientEmailHTML } from './templates';
import { ShipmentEmailData } from '@/types/email';

export interface EmailResult {
  success: boolean;
  recipient: string;
  error?: string;
}

export interface ShipmentEmailResult {
  senderEmail: EmailResult;
  recipientEmail: EmailResult;
  allSucceeded: boolean;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      const config = getEmailConfig();
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.auth.user,
          pass: config.auth.pass,
        },
      });
    }
    return this.transporter;
  }

  async sendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
    try {
      const config = getEmailConfig();
      const transporter = this.getTransporter();

      await transporter.sendMail({
        from: `Reptile Global <${config.auth.user}>`,
        to,
        subject,
        html,
      });

      return {
        success: true,
        recipient: to,
      };
    } catch (error: any) {
      console.error(`Failed to send email to ${to}:`, error);
      return {
        success: false,
        recipient: to,
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async sendShipmentEmails(shipmentData: ShipmentEmailData): Promise<ShipmentEmailResult> {
    const senderHTML = generateSenderEmailHTML(shipmentData);
    const recipientHTML = generateRecipientEmailHTML(shipmentData);

    // Send both emails concurrently
    const [senderResult, recipientResult] = await Promise.all([
      this.sendEmail(
        shipmentData.senderEmail,
        `Shipment Confirmation - ${shipmentData.trackingNumber}`,
        senderHTML
      ),
      this.sendEmail(
        shipmentData.recipientEmail,
        `Incoming Package from ${shipmentData.senderName} - ${shipmentData.trackingNumber}`,
        recipientHTML
      ),
    ]);

    const allSucceeded = senderResult.success && recipientResult.success;

    return {
      senderEmail: senderResult,
      recipientEmail: recipientResult,
      allSucceeded,
    };
  }

  async sendShipmentEmailsWithErrorHandling(
    shipmentData: ShipmentEmailData
  ): Promise<ShipmentEmailResult> {
    const result = await this.sendShipmentEmails(shipmentData);
    const failOnError = shouldFailOnEmailError();

    if (failOnError && !result.allSucceeded) {
      const errors: string[] = [];
      if (!result.senderEmail.success) {
        errors.push(`Sender email failed: ${result.senderEmail.error}`);
      }
      if (!result.recipientEmail.success) {
        errors.push(`Recipient email failed: ${result.recipientEmail.error}`);
      }
      throw new Error(`Email delivery failed: ${errors.join('; ')}`);
    }

    return result;
  }
}

export const emailService = new EmailService();
