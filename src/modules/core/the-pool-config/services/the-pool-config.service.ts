import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEY } from '@src/modules/core/the-pool-config/constants/the-pool-config.constant';

@Injectable()
export class ThePoolConfigService {
  private readonly NODE_ENV: string;
  private readonly PRODUCTION = 'production';
  private readonly DEVELOPMENT = 'development';
  private readonly LOCAL = 'local';

  constructor(
    private readonly configService: ConfigService<typeof ENV_KEY, true>,
  ) {}

  get<T>(key: typeof ENV_KEY[keyof typeof ENV_KEY]): T {
    return this.configService.get<T>(key);
  }

  getAll(): (string | number)[] {
    return Object.values(ENV_KEY).map((key) => {
      return this.get<typeof key>(key);
    });
  }

  getAllMap(): Record<keyof typeof ENV_KEY, string | number> {
    return Object.entries(ENV_KEY).reduce(
      (acc: typeof ENV_KEY, [key, value]) => {
        acc[key] = this.get<typeof key>(value);

        return acc;
      },
      <Record<keyof typeof ENV_KEY, string | number>>{},
    );
  }

  isLocal(): boolean {
    return this.get<string>('NODE_ENV') === this.LOCAL;
  }

  isDevelopment(): boolean {
    return this.get<string>('NODE_ENV') === this.DEVELOPMENT;
  }

  isProduction(): boolean {
    return this.get<string>('NODE_ENV') === this.PRODUCTION;
  }
}
