import { Prisma } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Duplicate entry. A record with this value already exists.');
      case 'P2025':
        throw new BadRequestException('Record to update/delete does not exist.');
      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed.');
      case 'P2001':
        throw new BadRequestException('Record not found.');
      case 'P2000':
        throw new BadRequestException('Value is too long for the field.');
      case 'P2014':
        throw new BadRequestException('Relation violation.');
    }
  }
}
