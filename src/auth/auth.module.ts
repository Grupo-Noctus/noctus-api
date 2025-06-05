import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from 'src/upload/upload.module';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
  imports: [
    UserModule,
    UploadModule,
    EnrollmentModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class AuthModule {}
