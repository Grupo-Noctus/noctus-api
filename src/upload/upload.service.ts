import * as path from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises'; 
import { IUploadService } from './interface/upload.interface';
import getVideoDuration from 'get-video-duration';
import { VideoMetadata } from './dto/video-metadata.dto';

@Injectable()
export class UploadService implements IUploadService{ 

  async uploadFileMetadata(
    file: Express.Multer.File,  
    subfolder: string 
  ): Promise<string> {
    let filePath: string;  

    try {
      filePath = path.join(subfolder, file.filename);

      return filePath;
    } catch (error) {
      
      if (filePath) {
        try {
          await fs.unlink(filePath);  
        } catch (unlinkError) {
          console.error('Error deleting the file:', unlinkError);
        }
      }
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  async uploadVideoMetadata(
    file: Express.Multer.File,
    subfolder: string
  ): Promise<VideoMetadata> {
    let filePath: string;

    try {
      filePath = path.join(subfolder, file.filename);

      const duration = await this.getVideoDuration(filePath);

      return {
        duration,
        key: file.filename,
        url: path.join(subfolder, file.filename).replace(/\\/g, '/'),
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Error deleting the file:', unlinkError);
        }
      }
      throw error;
    }
  }

  private async getVideoDuration(filePath: string): Promise<number> {
    try {
      const duration = await getVideoDuration(filePath);
      return Math.round(duration || 0); 
    } catch (err) {
      console.error('Error getting video duration:', err);
      throw new BadRequestException('Error processing video duration');
    }
  }
}
