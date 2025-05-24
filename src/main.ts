
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { UserRegisterDto } from './auth/dto/request/user-register.request.dto';
import { StudentRegisterDto } from './auth/dto/request/student-register.request.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  const config = new DocumentBuilder()
    .setTitle('Noctus')
    .setDescription('Noctus API')
    .setVersion('1.0')
    .addTag('Enrollment')
    .addTag('Auth')
    .addTag('Course')
    .addTag('CourseAdmin')
    .addTag('Module')
    .addTag('Material')
    .addTag('Streaming')
    .addBearerAuth()
    .addServer('http://localhost:3000') 
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    extraModels: [UserRegisterDto, StudentRegisterDto],
  });
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );

  app.enableCors({
    origin: '*' //no ambiente de produção colocar o dominio
  });

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  await app.listen(process.env.PORT);
}
bootstrap();
