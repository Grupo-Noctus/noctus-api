import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor( 
        private jwt: JwtService,
        private userService: UserService,
    ){}

    async singIn (username: string, pass: string): Promise<{ access_token: string}>{
        const user = await this.userService.findByUsernameForAuth(username);

        if(user?.password !== pass){
            throw new UnauthorizedException();
        }

        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
            active: user.active
        }

        return {
            access_token: await this.jwt.signAsync(payload),
        }
    }
}
