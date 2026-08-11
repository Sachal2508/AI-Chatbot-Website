import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly groq: Groq;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey });
    this.model = this.config.get<string>('GROQ_MODEL') || 'llama-3.3-70b-versatile';
  }

  async sendMessage(dto: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content:
            'You are a helpful, concise AI assistant embedded in a chatbot API.',
        },
        ...(dto.history || []).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: dto.message },
      ];

      const completion = await this.groq.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply = completion.choices[0]?.message?.content ?? '';

      return {
        reply,
        model: this.model,
        tokensUsed: completion.usage?.total_tokens ?? 0,
      };
    } catch (error) {
      this.logger.error('Groq API call failed', error as Error);
      // Re-thrown as a 500 so the global Sentry filter captures it
      throw new InternalServerErrorException(
        'Failed to get a response from the AI model.',
      );
    }
  }
}
