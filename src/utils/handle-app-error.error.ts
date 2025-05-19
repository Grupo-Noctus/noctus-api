import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handleAppError(error: any): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        throw new BadRequestException('Value too long for column.');

      case 'P2001':
        throw new NotFoundException('Record not found.');

      case 'P2002': {
        const fields = Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : error.meta?.target ?? 'unique field';

        throw new ConflictException(`Duplicate value for: ${fields}`);
      }

      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed.');

      case 'P2004':
        throw new ForbiddenException('Database constraint violated.');

      case 'P2005':
        throw new BadRequestException('Invalid value for field.');

      case 'P2006':
        throw new BadRequestException('Missing value for field.');

      case 'P2007':
        throw new BadRequestException('Data validation error.');

      case 'P2008':
        throw new InternalServerErrorException('Query interpretation error.');

      case 'P2009':
        throw new InternalServerErrorException('Query validation error.');

      case 'P2010':
        throw new BadRequestException('Raw query failed.');

      case 'P2011':
        throw new BadRequestException('Null constraint violation.');

      case 'P2012':
        throw new BadRequestException('Missing required value.');

      case 'P2013':
        throw new BadRequestException('Missing required argument.');

      case 'P2014':
        throw new BadRequestException('Relation violation in nested write.');

      case 'P2015':
        throw new NotFoundException('Record for relation not found.');

      case 'P2016':
        throw new InternalServerErrorException('Invalid field in query.');

      case 'P2017':
        throw new BadRequestException('Relation records not connected.');

      case 'P2018':
        throw new BadRequestException('Required connected records not found.');

      case 'P2019':
        throw new BadRequestException('Input value is invalid.');

      case 'P2020':
        throw new BadRequestException('Value out of range.');

      case 'P2021':
        throw new InternalServerErrorException('Invalid table.');

      case 'P2022':
        throw new InternalServerErrorException('Column not found.');

      case 'P2023':
        throw new InternalServerErrorException('Inconsistent database.');

      case 'P2024':
        throw new InternalServerErrorException('Timeout while fetching result.');

      case 'P2025':
        throw new NotFoundException('Record not found.');

      case 'P2026':
        throw new InternalServerErrorException('Unsupported feature.');

      case 'P2027':
        throw new InternalServerErrorException('Transaction failed.');

      case 'P2028':
        throw new InternalServerErrorException('Database connection timeout.');

      case 'P2030':
        throw new InternalServerErrorException('Database error: too many connections.');

      case 'P2033':
        throw new InternalServerErrorException('Invalid argument in query.');

      default:
        throw new InternalServerErrorException(`Database error [${error.code}].`);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException('Invalid input data.');
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new InternalServerErrorException('Database initialization error.');
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw new InternalServerErrorException('Unexpected database panic.');
  }

  throw new InternalServerErrorException('Unexpected server error.');
}
