import { VideoMetadata } from '../dto/video-metadata.dto';

export interface IUploadService {
  uploadFileMetadata(file: Express.Multer.File, subfolder: string): Promise<string>;

  deleteFile(filePath: string): Promise<void>;

  uploadVideoMetadata(file: Express.Multer.File, subfolder: string): Promise<VideoMetadata>;
}
