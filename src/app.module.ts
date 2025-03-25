import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { RolesGuard } from './auth/guard/role.guard';
import { CourseModule } from './course/course.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    CourseModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
        blockDuration: 5000,
      }
    ]),
    ModuleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass:ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
  ],
})
export class AppModule {}
