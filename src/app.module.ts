import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { ConfigModule } from '@nestjs/config';

import { RedisModule } from '@liaoliaots/nestjs-redis';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitModule } from '@app/rate-limit';
@Module({
  imports: [
    ConfigModule.forRoot(),

    /**
     * Overall application throthhling
     * Set high to avoid missuse e.t.c
     */
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1300,
      // storage: new ThrottlerStorageRedisService(process.env.REDIS_DB),
    }),

    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_DB,
      },
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'rateLimitterDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),

    UsersModule,
    AuthModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
