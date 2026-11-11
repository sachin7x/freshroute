import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'FreshRoute API',
      timestamp: new Date().toISOString(),
    };
  }
}
