import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
  ],
  exports: ['IUserService'],
})
export class UserModule {}
