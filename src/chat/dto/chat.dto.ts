import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  @IsString()
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'What is NestJS?' })
  @IsString()
  content: string;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'The message to send to the AI chatbot',
    example: 'Explain REST APIs in simple terms.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  message: string;

  @ApiPropertyOptional({
    description: 'Optional prior conversation history for context',
    type: [ChatMessageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  history?: ChatMessageDto[];
}

export class ChatResponseDto {
  @ApiProperty({ example: 'REST APIs let systems talk to each other over HTTP...' })
  reply: string;

  @ApiProperty({ example: 'llama-3.3-70b-versatile' })
  model: string;

  @ApiProperty({ example: 128 })
  tokensUsed: number;
}
