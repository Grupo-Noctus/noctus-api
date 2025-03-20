import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*' //no ambiente de produção colocar o dominio
  });
  await app.listen(process.env.PORT);
}
bootstrap();
