import { RateLimitService } from '@app/rate-limit';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(private rateLimitService: RateLimitService) {}
  /**
   * Should send sms
   * @returns
   */
  async sendSmsTest(req: Request): Promise<{ status: string }> {
    /**
     * Do Request
     */
    /**
     * On successfull message sent we mark a new rate
     */
    await this.rateLimitService.storeRate((req as any).user);
    /**
     * Return response
     */
    return {
      status: 'Should send sms!',
    };
  }
}
