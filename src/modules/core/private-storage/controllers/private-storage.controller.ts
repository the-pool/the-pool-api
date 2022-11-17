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
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
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
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, '소셜 로그인에 실패하였습니다.')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getSignedUrl(@Body() getSignedUrlDto: GetSignedUrlDto) {
    return await this.privateStorageService.getSignedUrl(getSignedUrlDto);
  }
}
