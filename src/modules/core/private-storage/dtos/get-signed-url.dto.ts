import { ApiProperty } from '@nestjs/swagger';
import { FileSignedUrl } from '@src/modules/core/private-storage/interfaces/file-signed-url.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetSignedUrlDto implements FileSignedUrl {
  @ApiProperty({
    example: 'member',
    description: '업로드하려는 파일이 속할 폴더명',
  })
  @IsString()
  @IsNotEmpty()
  folderName: string;

  @ApiProperty({
    example: 'the-pool',
    description: '업로드하려는 확장명을 제외한 파일의 이름',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  // IsEnum으로 받을 수 없는 확장명 관리를 할 수 있을 것 같아서 따로 받으려 합니다.
  @ApiProperty({
    example: 'png',
    description: '업로드하려는 파일의 확장명',
  })
  @IsString()
  @IsNotEmpty()
  fileType: string;
}
