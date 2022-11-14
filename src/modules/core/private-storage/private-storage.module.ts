import { Module } from '@nestjs/common';
import { PrivateStorageController } from './controllers/private-storage.controller';
import { PRIVATE_STORAGE_SERVICE } from './interfaces/private-storage-service.interface';
import { AwsS3StorageService } from './services/aws-s3-storage.service';

@Module({
  controllers: [PrivateStorageController],
  providers: [
    {
      provide: PRIVATE_STORAGE_SERVICE,
      useClass: AwsS3StorageService,
    },
  ],
})
export class PrivateStorageModule {}
