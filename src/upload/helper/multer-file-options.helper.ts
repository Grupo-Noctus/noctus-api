import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { generateUniqueKey } from 'src/utils/genarate-unique-key';

export function multerFileOptions(destination: string, allowedMimeTypes: RegExp) {
  return {
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(allowedMimeTypes)) {
        return cb(new BadRequestException('Invalid file type'), false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: (req, file, cb) => cb(null, destination),
      filename: (req, file, cb) => {
        const key = generateUniqueKey(file.originalname, file.mimetype);
        cb(null, key);
      },
    }),
  };
}

interface FieldOptions {
  destination: string;
  allowedMimeTypes: RegExp;
}

export function multerFieldsOptions(fieldsConfig: Record<string, FieldOptions>) {
  return {
    fileFilter: (req, file, cb) => {
      const field = fieldsConfig[file.fieldname];
      if (!field || !file.mimetype.match(field.allowedMimeTypes)) {
        return cb(
          new BadRequestException(`Invalid file type for field "${file.fieldname}"`),
          false,
        );
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const field = fieldsConfig[file.fieldname];
        cb(null, field?.destination ?? './uploads');
      },
      filename: (req, file, cb) => {
        const key = generateUniqueKey(file.originalname, file.mimetype);
        cb(null, key);
      },
    }),
  };
}
