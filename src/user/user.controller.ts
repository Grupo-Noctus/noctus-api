import { Controller, Inject } from '@nestjs/common';
import { IUserService } from './interface/user.service.interface';

@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}
}
