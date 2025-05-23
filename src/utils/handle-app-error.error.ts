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

export function handleAppError(error: any): HttpException {
  if (error instanceof HttpException) {
    return error;
  }
  if (Array.isArray(error)) {
    return new BadRequestException(error);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        return new BadRequestException('Value too long for column.');
      case 'P2001':
        return new NotFoundException('Record not found.');
      case 'P2002': {
        const fields = Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : error.meta?.target ?? 'unique field';
        return new ConflictException(`Duplicate value for: ${fields}`);
      }
      case 'P2003':
        return new BadRequestException('Foreign key constraint failed.');
      case 'P2004':
        return new ForbiddenException('Database constraint violated.');
      case 'P2005':
        return new BadRequestException('Invalid value for field.');
      case 'P2006':
        return new BadRequestException('Missing value for field.');
      case 'P2007':
        return new BadRequestException('Data validation error.');
      case 'P2008':
        return new InternalServerErrorException('Query interpretation error.');
      case 'P2009':
        return new InternalServerErrorException('Query validation error.');
      case 'P2010':
        return new BadRequestException('Raw query failed.');
      case 'P2011':
        return new BadRequestException('Null constraint violation.');
      case 'P2012':
        return new BadRequestException('Missing required value.');
      case 'P2013':
        return new BadRequestException('Missing required argument.');
      case 'P2014':
        return new BadRequestException('Relation violation in nested write.');
      case 'P2015':
        return new NotFoundException('Record for relation not found.');
      case 'P2016':
        return new InternalServerErrorException('Invalid field in query.');
      case 'P2017':
        return new BadRequestException('Relation records not connected.');
      case 'P2018':
        return new BadRequestException('Required connected records not found.');
      case 'P2019':
        return new BadRequestException('Input value is invalid.');
      case 'P2020':
        return new BadRequestException('Value out of range.');
      case 'P2021':
        return new InternalServerErrorException('Invalid table.');
      case 'P2022':
        return new InternalServerErrorException('Column not found.');
      case 'P2023':
        return new InternalServerErrorException('Inconsistent database.');
      case 'P2024':
        return new InternalServerErrorException('Timeout while fetching result.');
      case 'P2025':
        return new NotFoundException('Record not found.');
      case 'P2026':
        return new InternalServerErrorException('Unsupported feature.');
      case 'P2027':
        return new InternalServerErrorException('Transaction failed.');
      case 'P2028':
        return new InternalServerErrorException('Database connection timeout.');
      case 'P2030':
        return new InternalServerErrorException('Database error: too many connections.');
      case 'P2033':
        return new InternalServerErrorException('Invalid argument in query.');
      default:
        return new InternalServerErrorException(`Database error [${error.code}].`);
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException('Invalid input data.');
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new InternalServerErrorException('Database initialization error.');
  }
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new InternalServerErrorException('Unexpected database panic.');
  }
  return new InternalServerErrorException('Unexpected server error.');
}
