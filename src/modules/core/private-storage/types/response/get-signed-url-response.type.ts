import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlResponseType {
  @ApiProperty({
    description: 's3에 저장될 이미지 url',
    example: 'example/123456789the-pool.png',
  })
  imgName: string;

  @ApiProperty({
    description: 's3에 이미지 저장을 위한 presignedUrl',
    example:
      'https://aws.amazonaws.com/example/123456789the-pool.png?123-Amz-SignedHeaders=host',
  })
  s3Url: string;
}
