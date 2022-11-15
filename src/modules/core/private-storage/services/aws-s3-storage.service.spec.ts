import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3StorageService } from './aws-s3-storage.service';
import { GetSignedUrlDto } from '../dtos/get-signed-url.dto';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';

describe('AwsS3StorageService', () => {
  let awsS3StorageService: AwsS3StorageService;
  beforeEach(async () => {
    const ConfigKeyMap = {
      AWS_S3_ACCESS_KEY: 'ACCESS_KEY',
      AWS_S3_SECRET_KEY: 'SECRET_KEY',
      AWS_S3_REGION: 'REGION',
      AWS_S3_BUCKET_NAME: 'BUCKET_NAME',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3StorageService,
        {
          provide: ConfigService,
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
      expect(returnValue).toHaveProperty('s3Url');
      expect(returnValue.imgName).toMatch(
        `${getSignedUrlDto.folderName + '/'}`,
      );
      expect(returnValue.imgName).toMatch(
        `${getSignedUrlDto.fileName + '.' + getSignedUrlDto.fileType}`,
      );
    });
  });
});
