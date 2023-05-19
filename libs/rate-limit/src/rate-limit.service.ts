import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Users } from 'src/users/users.entity';

@Injectable()
export class RateLimitService {
  constructor(@InjectRedis() private redis: Redis) {}

  private getMonth() {
    const date = new Date();
    const month = `${date.getMonth() + 1}.${date.getFullYear()}`;
    return month;
  }

  /**
   * @TODO Improve to make path to seconds and expire in redis after a second
   * @param user
   * @returns
   */
  private getPath(user: Users) {
    return `requests.${user.username}.${this.getMonth()}`;
  }
  /**
   * You can use it in the RateLimiting guard
   * @param user
   */
  async checkRate(user: Users) {
    const requestsStr = await this.redis.get(this.getPath(user));
    const requests = parseInt(requestsStr ?? '0');

    if (requests > user.limit) {
      throw new ForbiddenException('User exceeded montly limit.');
    } else {
    }
  }

  /**
   * Cache rate
   * You can call this function to run async after every request
   * @param user
   */
  async storeRate(user: any) {
    const requestsStr = await this.redis.get(this.getPath(user));
    const requests = parseInt(requestsStr ?? '0') + 1;
    return this.redis.set(this.getPath(user), requests);
  }
}
