import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [],
  providers: [RateLimitService],
  exports: [RateLimitService],
})
export class RateLimitModule {}
