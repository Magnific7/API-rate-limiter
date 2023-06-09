import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { RateLimitGuard } from '@app/rate-limit/rate-limit.guard';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

@Throttle(3, 60)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard, RateLimitGuard)
  @Post('send-sms')
  sendSms(@Req() req): Promise<{ status: string }> {
    return this.appService.sendSmsTest(req);
  }
}
