import { Injectable } from '@nestjs/common';
import { GetSignedUrlDto } from '@src/modules/core/private-storage/dtos/get-signed-url.dto';
import { PrivateStorageService } from '@src/modules/core/private-storage/interfaces/private-storage-service.interface';
import { ENV_KEY } from '@src/modules/core/the-pool-config/constants/the-pool-config.constant';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import AWS from 'aws-sdk';

@Injectable()
export class AwsS3StorageService implements PrivateStorageService {
  private readonly awsS3: AWS.S3;
  private readonly awsS3Bucket: string | undefined;
  private readonly awsS3ACL: string | undefined;
  private readonly awsS3Expires: number | undefined;

  constructor(private readonly thePoolConfigService: ThePoolConfigService) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.thePoolConfigService.get(ENV_KEY.AWS_ACCESS_KEY),
      secretAccessKey: this.thePoolConfigService.get(ENV_KEY.AWS_SECRET_KEY),
      region: this.thePoolConfigService.get(ENV_KEY.AWS_S3_REGION),
    });
    this.awsS3Bucket = this.thePoolConfigService.get<string>(
      ENV_KEY.AWS_S3_BUCKET_NAME,
    );
    this.awsS3ACL = this.thePoolConfigService.get<string>(ENV_KEY.AWS_S3_ACL);
    this.awsS3Expires = this.thePoolConfigService.get<number>(
      ENV_KEY.AWS_S3_EXPIRES,
    );
  }

  async getSignedUrl({
    folderName,
    fileType,
    fileName,
  }: GetSignedUrlDto): Promise<{
    imgName: string;
    signedUrl: string;
  }> {
    const imgName = `${folderName + '/' + Date.now() + fileName}.${fileType}`;
    const params = {
      Bucket: this.awsS3Bucket,
      Key: imgName,
      Expires: this.awsS3Expires,
      ACL: this.awsS3ACL,
    };
    const signedUrl = await this.awsS3.getSignedUrlPromise('putObject', params);

    return {
      imgName,
      signedUrl,
    };
  }
}
