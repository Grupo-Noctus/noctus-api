import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function handleHttpError(error: any): never {
  if (error instanceof HttpException) {
    throw error;
  }

  throw new InternalServerErrorException('Unexpected server error.');
}