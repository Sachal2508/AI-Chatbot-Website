import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import Groq from 'groq-sdk';
import { SendSummaryDto, TestEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly groq: Groq;
  private readonly fromEmail: string;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.groq = new Groq({ apiKey: this.config.get<string>('GROQ_API_KEY') });
    this.fromEmail =
      this.config.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
    this.model = this.config.get<string>('GROQ_MODEL') || 'llama-3.3-70b-versatile';
  }

  async sendTestEmail(dto: TestEmailDto) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: dto.to,
        subject: 'Test Email - AI Chatbot API',
        html: `<p>This is a test email from the AI Chatbot API (NestJS + Resend). If you received this, email sending works ✅</p>`,
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (error) {
      const err = error as Error;
      this.logger.error('Resend test email failed', err);
      throw new InternalServerErrorException(err.message || 'Failed to send test email.');
    }
  }

  async sendConversationSummary(dto: SendSummaryDto) {
    try {
      const transcript = dto.conversation
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');

      const completion = await this.groq.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'Summarize the following chatbot conversation in 3-5 concise bullet points, in HTML <ul><li> format only, no extra commentary.',
          },
          { role: 'user', content: transcript },
        ],
        temperature: 0.3,
        max_tokens: 400,
      });

      const summaryHtml =
        completion.choices[0]?.message?.content ?? '<p>No summary available.</p>';

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: dto.to,
        subject: 'Your AI Chatbot Conversation Summary',
        html: `
          <h2>Conversation Summary</h2>
          ${summaryHtml}
          <hr/>
          <p style="color:#888;font-size:12px;">Sent automatically by the AI Chatbot API.</p>
        `,
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (error) {
      const err = error as Error;
      this.logger.error('Resend summary email failed', err);
      throw new InternalServerErrorException(
        err.message || 'Failed to generate or send conversation summary.',
      );
    }
  }
}
