import { InternalServerErrorException } from "@nestjs/common";
import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid';

export function generateUniqueKey(filename: string, mimetype: string): string {
  try {
    const slugifiedName = slugify(filename, { lower: true, strict: true, replacement: '-' });
    const uniqueId = uuidv4();

    const extension = mimetype.split('/').pop();

    if (!extension) {
      throw new Error('Invalid mimetype');
    }

    return `${slugifiedName}-${uniqueId}.${extension}`;
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException();
  }
}