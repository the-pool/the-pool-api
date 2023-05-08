import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { mockConfigService } from '@test/mock/mock-services';

describe('ThePoolConfigService', () => {
  let service: ThePoolConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThePoolConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ThePoolConfigService>(ThePoolConfigService);
  });

  describe('get', () => {
    it('값 반환', () => {
      mockConfigService.get.mockReturnValue('value');

      expect(service.get('key' as any)).toBeDefined();
    });

    it('undefined 반환', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(service.get('key' as any)).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('모든 env 키가 존재할 때', () => {
      mockConfigService.get.mockReturnValue('value');

      expect(service.getAll()).not.toContain(undefined);
    });

    it('존재하지 않는 env 가 있을 때', () => {
      mockConfigService.get.mockReturnValueOnce(undefined);
      mockConfigService.get.mockReturnValue('value');

      expect(service.getAll()).toContain(undefined);
    });
  });

  describe('getAllMap', () => {
    it('모든 env 키가 존재할 때', () => {
      mockConfigService.get.mockReturnValue('value');

      expect(Object.values(service.getAllMap()).every((el) => el)).toBe(true);
    });

    it('존재하지 않는 env 가 있을 때', () => {
      mockConfigService.get.mockReturnValueOnce(undefined);
      mockConfigService.get.mockReturnValue('value');

      expect(Object.values(service.getAllMap()).every((el) => el)).toBe(false);
    });
  });

  describe('isLocal', () => {
    it('NODE_ENV 가 없을 때', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(service.isLocal()).toBe(false);
    });

    it('local 환경이 아닐 때', () => {
      mockConfigService.get.mockReturnValue('production');

      expect(service.isLocal()).toBe(false);
    });

    it('local 환경일 때', () => {
      mockConfigService.get.mockReturnValue('local');

      expect(service.isLocal()).toBe(true);
    });
  });

  describe('isDevelopment', () => {
    it('NODE_ENV 가 없을 때', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(service.isDevelopment()).toBe(false);
    });

    it('development 환경이 아닐 때', () => {
      mockConfigService.get.mockReturnValue('local');

      expect(service.isDevelopment()).toBe(false);
    });

    it('development 환경일 때', () => {
      mockConfigService.get.mockReturnValue('development');

      expect(service.isDevelopment()).toBe(true);
    });
  });

  describe('isProduction', () => {
    it('NODE_ENV 가 없을 때', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(service.isProduction()).toBe(false);
    });

    it('production 환경이 아닐 때', () => {
      mockConfigService.get.mockReturnValue('development');

      expect(service.isProduction()).toBe(false);
    });

    it('production 환경일 때', () => {
      mockConfigService.get.mockReturnValue('production');

      expect(service.isProduction()).toBe(true);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
