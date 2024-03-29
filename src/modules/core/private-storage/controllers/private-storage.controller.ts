import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { GetSignedUrlDto } from '@src/modules/core/private-storage/dtos/get-signed-url.dto';
import {
  PRIVATE_STORAGE_SERVICE,
  PrivateStorageService,
} from '@src/modules/core/private-storage/interfaces/private-storage-service.interface';
import { GetSignedUrlResponseType } from '@src/modules/core/private-storage/types/response/get-signed-url-response.type';

@ApiTags('PrivateStorage')
@Controller('api/private-storage')
export class PrivateStorageController {
  constructor(
    @Inject(PRIVATE_STORAGE_SERVICE)
    private privateStorageService: PrivateStorageService,
  ) {}

  @Post('/signed-url')
  @ApiOperation({ summary: 'preSignedUrl 발급' })
  @ApiCreatedResponse({ type: GetSignedUrlResponseType })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getSignedUrl(@Body() getSignedUrlDto: GetSignedUrlDto) {
    return this.privateStorageService.getSignedUrl(getSignedUrlDto);
  }
}
