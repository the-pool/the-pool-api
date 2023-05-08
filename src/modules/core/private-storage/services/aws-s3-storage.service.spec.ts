import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { GetSignedUrlDto } from '@src/modules/core/private-storage/dtos/get-signed-url.dto';
import { AwsS3StorageService } from '@src/modules/core/private-storage/services/aws-s3-storage.service';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';

describe('AwsS3StorageService', () => {
  let awsS3StorageService: AwsS3StorageService;
  beforeEach(async () => {
    const ConfigKeyMap = {
      AWS_ACCESS_KEY: 'ACCESS_KEY',
      AWS_SECRET_KEY: 'SECRET_KEY',
      AWS_S3_REGION: 'REGION',
      AWS_S3_BUCKET_NAME: 'BUCKET_NAME',
      AWS_S3_ACL: 'ACL',
      AWS_S3_EXPIRES: 3600,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3StorageService,
        {
          provide: ThePoolConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return ConfigKeyMap[key];
            }),
          },
        },
      ],
    }).compile();
    awsS3StorageService = module.get<AwsS3StorageService>(AwsS3StorageService);
  });

  it('should be defined', () => {
    expect(awsS3StorageService).toBeDefined();
  });

  describe('getSignedUrl', () => {
    let getSignedUrlDto: GetSignedUrlDto;
    beforeEach(async () => {
      getSignedUrlDto = {
        folderName: faker.lorem.word(),
        fileName: faker.lorem.word(),
        fileType: faker.system.commonFileExt(),
      };
    });

    it('success', async () => {
      const returnValue = await awsS3StorageService.getSignedUrl(
        getSignedUrlDto,
      );

      expect(returnValue).toHaveProperty('imgName');
      expect(returnValue).toHaveProperty('signedUrl');
      expect(returnValue.imgName).toMatch(
        `${getSignedUrlDto.folderName + '/'}`,
      );
      expect(returnValue.imgName).toMatch(
        `${getSignedUrlDto.fileName + '.' + getSignedUrlDto.fileType}`,
      );
    });
  });
});
