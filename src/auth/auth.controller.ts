import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn (@Body() user: UserAuthDto): Promise <{access_token: string}>{
    return await this.authService.singIn(user.username, user.password);
  }

  @Get('testeAuthGuard')
  testandoGuard (){
    console.log("Helloo");
  }

}
