import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessageDto } from '../../chat/dto/chat.dto';

export class TestEmailDto {
  @ApiProperty({ example: 'sachal@example.com' })
  @IsEmail()
  to: string;
}

export class SendSummaryDto {
  @ApiProperty({ example: 'sachal@example.com' })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'The conversation to summarize and email',
    type: [ChatMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  conversation: ChatMessageDto[];
}
