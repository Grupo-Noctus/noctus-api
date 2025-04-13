import { InternalServerErrorException } from "@nestjs/common";
import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid';

export function generateUniqueKey(filename: string): string {
    try{
      const slugifiedName = slugify(filename, { lower: true, strict: true, replacement: '-' });

      const uniqueId = uuidv4();

      return `${slugifiedName}-${uniqueId}`;
    }catch (error){
      console.error(error);
      throw new InternalServerErrorException();
    }
  }