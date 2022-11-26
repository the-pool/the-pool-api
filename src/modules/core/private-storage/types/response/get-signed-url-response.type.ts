import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlResponseType {
  @ApiProperty({
    description: 's3에 저장될 폴더명/이미지명',
    example: 'example/123456789the-pool.png',
  })
  imgName: string;

  @ApiProperty({
    description: 's3로부터 발급된 서명된 url',
    example:
      'https://aws.amazonaws.com/example/123456789the-pool.png?123-Amz-SignedHeaders=host',
  })
  signedUrl: string;
}
