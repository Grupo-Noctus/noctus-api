export abstract class IUploadService {
  abstract uploadFileMetadata(
    file: Express.Multer.File,
    subfolder: string,
    allowedMimeTypes: RegExp
  ): Promise<string>;

  abstract uploadVideoMetadata(
    file: Express.Multer.File,
    subfolder: string,
    allowedMimeTypes: RegExp
  ): Promise<{
    duration: number;
    key: string;
    url: string;
    mimetype: string;
  }>;

  abstract deleteFile(path: string): Promise<void>;
}
