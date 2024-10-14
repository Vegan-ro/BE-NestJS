import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConfigService {
  constructor(private configService: ConfigService) {}

  get applicationName(): string {
    return this.configService.get<string>('APPLICATION_NAME');
  }

  get port(): number {
    return this.configService.get<number>('PORT');
  }

  get mongoDBUri(): string {
    return this.configService.get<string>('MONGO_URI');
  }

  get clientID(): string {
    return this.configService.get<string>('KAKAO_ID');
  }

  get callbackURL(): string {
    return this.configService.get<string>('KAKAO_URL');
  }

  get redirectURL(): string {
    return this.configService.get<string>('REDIRECT_URL');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
}
