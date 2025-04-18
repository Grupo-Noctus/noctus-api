import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateUniqueKey } from 'src/utils/genarate-unique-key';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '7d'}
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/images-users',
        filename: (req, file, callback) => {
          const uniqueKey = generateUniqueKey(file.originalname, file.mimetype); 
          callback(null, uniqueKey);
        },
      }),
    })
  ]
})
export class AuthModule {}
