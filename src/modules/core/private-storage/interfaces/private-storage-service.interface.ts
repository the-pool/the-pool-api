import { FileSignedUrl } from '@src/modules/core/private-storage/interfaces/file-signed-url.interface';

export const PRIVATE_STORAGE_SERVICE = 'PRIVATE STORAGE SERVICE';

export interface PrivateStorageService {
  getSignedUrl(fileSignedUrl: FileSignedUrl): Promise<{
    imgName: string;
    signedUrl: string;
  }>;
}
