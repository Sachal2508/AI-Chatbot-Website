import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendSummaryDto, TestEmailDto } from './dto/email.dto';

@ApiTags('email')
@Controller('api/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @ApiOperation({ summary: 'Send a simple test email via Resend' })
  async test(@Body() dto: TestEmailDto) {
    return this.emailService.sendTestEmail(dto);
  }

  @Post('summary')
  @ApiOperation({
    summary: 'AI-summarize a chat conversation and email it to the user',
  })
  async summary(@Body() dto: SendSummaryDto) {
    return this.emailService.sendConversationSummary(dto);
  }
}
