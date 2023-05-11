import { Module } from '@nestjs/common';
import { UploadsController } from '@src/modules/uploads/uploads.controller';

@Module({
  controllers: [UploadsController],
  providers: [],
})
export class UploadsModule {}
