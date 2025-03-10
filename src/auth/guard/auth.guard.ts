import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { IS_PUBUBLIC_KEY } from "../decorator/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwt: JwtService,
        private reflector: Reflector,
    ){}

    async canActivate(context: ExecutionContext): Promise <boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBUBLIC_KEY, [
            context.getHandler(),
            context.getClass,
        ]);

        if(isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if(!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwt.verifyAsync(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );

            request['user'] = payload
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}