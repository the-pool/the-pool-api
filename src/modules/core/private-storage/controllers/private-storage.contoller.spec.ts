import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrivateStorageController } from '@src/modules/core/private-storage/controllers/private-storage.controller';
import { GetSignedUrlDto } from '@src/modules/core/private-storage/dtos/get-signed-url.dto';
import { PRIVATE_STORAGE_SERVICE } from '@src/modules/core/private-storage/interfaces/private-storage-service.interface';
import { mockPrivateStorageService } from '@test/mock/mock-services';

describe('PrivateStorageController', () => {
  let privateStorageController: PrivateStorageController;
  let privateStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateStorageController],
      providers: [
        {
          provide: PRIVATE_STORAGE_SERVICE,
          useValue: mockPrivateStorageService,
        },
      ],
    }).compile();

    privateStorageController = module.get<PrivateStorageController>(
      PrivateStorageController,
    );
    privateStorageService = mockPrivateStorageService;
  });
  it('should be defined', () => {
    expect(privateStorageController).toBeDefined();
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
      const imgName = `${
        getSignedUrlDto.folderName + '/' + Date.now() + getSignedUrlDto.fileName
      }`;
      const s3Url = faker.image.imageUrl();

      privateStorageService.getSignedUrl.mockReturnValue({
        imgName,
        s3Url,
      });
      const returnValue = await privateStorageController.getSignedUrl(
        getSignedUrlDto,
      );

      expect(returnValue).toStrictEqual({
        imgName,
        s3Url,
      });
    });
  });
});
