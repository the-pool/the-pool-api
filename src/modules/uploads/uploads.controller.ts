import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class UploadRequestEntity {
  @ApiProperty({
    type: String,
    format: 'binary',
    description: '이미지 등',
  })
  data: BinaryType;
}

class UploadResponseEntity {
  @ApiProperty({
    description: '생성된 이미지 url',
    example: 'https://api.thepool.kr/uploads/thepool.png',
  })
  url: string;
}

@ApiTags('업로드')
@Controller('api/uploads')
export class UploadsController {
  @ApiOkResponse({ type: UploadResponseEntity })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('post/:name')
  createUploads(@Body() body: UploadRequestEntity): void {
    return;
  }
}
