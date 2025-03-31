
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Noctus')
    .setDescription('Noctus API')
    .setVersion('1.0')
    .addTag('Autenticação')
    .addTag('Enrollment')
    .addTag('Auth')
    .addTag('Course')
    .addTag('Module')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: '*' //no ambiente de produção colocar o dominio
  });
  await app.listen(process.env.PORT);
}
bootstrap();
