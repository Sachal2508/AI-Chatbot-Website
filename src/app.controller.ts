import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check - confirms the API is running' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('debug-sentry')
  @ApiOperation({
    summary:
      'Deliberately throws an error - use this to demo Sentry catching a live exception',
  })
  debugSentry() {
    throw new Error('Test error for Sentry - this is intentional 🎯');
  }
}
