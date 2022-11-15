import { ConfigService } from '@nestjs/config';
import { FileSignedUrl } from './file-signed-url.interface';

export const PRIVATE_STORAGE_SERVICE = 'PRIVATE STORAGE SERVICE';

export interface PrivateStorageService {
  getSignedUrl(fileSignedUrl: FileSignedUrl): Promise<{
    imgName: string;
    s3Url: string;
  }>;
}
