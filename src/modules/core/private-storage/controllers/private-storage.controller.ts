import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetSignedUrlDto } from '../dtos/get-signed-url.dto';
import {
  PrivateStorageService,
  PRIVATE_STORAGE_SERVICE,
} from '../interfaces/private-storage-service.interface';
import { GetSignedUrlResponseType } from '../types/response/get-signed-url-response.type';

@ApiTags('PrivateStorage')
@Controller('api/private-storage')
export class PrivateStorageController {
  constructor(
    @Inject(PRIVATE_STORAGE_SERVICE)
    private privateStorageService: PrivateStorageService,
  ) {}

  @Post('/signedUrl')
  @ApiOperation({ summary: 'presignedUrl 발급' })
  @ApiCreatedResponse({ type: GetSignedUrlResponseType })
  async getSignedUrl(@Body() getSignedUrlDto: GetSignedUrlDto) {
    return await this.privateStorageService.getSignedUrl(getSignedUrlDto);
  }
}
