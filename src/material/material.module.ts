import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, EncryptionService],
})
export class MaterialModule {}
