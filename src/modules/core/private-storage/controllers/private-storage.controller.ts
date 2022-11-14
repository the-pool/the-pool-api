import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetSignedUrlDto } from '../dtos/get-signed-url.dto';
import {
  PrivateStorageService,
  PRIVATE_STORAGE_SERVICE,
} from '../interfaces/private-storage-service.interface';

@ApiTags('PrivateStorage')
@Controller('private-storage')
export class PrivateStorageController {
  constructor(
    @Inject(PRIVATE_STORAGE_SERVICE)
    private privateStorageService: PrivateStorageService,
  ) {}

  @Post('/signedUrl')
  async getSignedUrl(@Body() getSignedUrlDto: GetSignedUrlDto) {
    return await this.privateStorageService.getSignedUrl(getSignedUrlDto);
  }
}
