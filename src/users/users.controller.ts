import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @UseGuards(LocalAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
