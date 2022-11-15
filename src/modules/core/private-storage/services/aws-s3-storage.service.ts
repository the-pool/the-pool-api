import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';
import { PrivateStorageService } from '../interfaces/private-storage-service.interface';
import { GetSignedUrlDto } from '../dtos/get-signed-url.dto';

@Injectable()
export class AwsS3StorageService implements PrivateStorageService {
  private awsS3Bucket: string;
  private awsS3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.awsS3Bucket = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  async getSignedUrl({
    folderName,
    fileType,
    fileName,
  }: GetSignedUrlDto): Promise<{
    imgName: string;
    s3Url: string;
  }> {
    const imgName: string = `${
      folderName + '/' + Date.now() + fileName
    }.${fileType}`;
    const params = {
      Bucket: this.awsS3Bucket,
      Key: imgName,
      Expires: 3600,
    };
    const s3Url = await this.awsS3.getSignedUrlPromise('putObject', params);

    return {
      imgName,
      s3Url,
    };
  }
}
