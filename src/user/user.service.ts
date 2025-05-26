import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAutResDto } from './dto/response/user-auth.response.dto';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { IUploadService } from 'src/upload/interface/upload.service.interface';
import { IUserService } from './interface/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findByUsernameOrEmailForAuth(usernameOrEmail: string): Promise<UserAutResDto> {
    try {
      return this.prisma.user.findFirst({
        where: {
          OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          password: true,
          image: true,
          role: true,
          active: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to find user by username or email: ${usernameOrEmail}`, error);
      throw handleAppError(error);
    }
  }

  async findStudentByIdUser(idUser: number): Promise<number> {
    try {
      const data = await this.prisma.student.findUnique({
        where: {
          idUser,
        },
        select: {
          id: true,
        },
      });

      return data.id;
    } catch (error) {
      this.logger.error(`Failed to find student by user ID: ${idUser}`, error);
      throw handleAppError(error);
    }
  }
}
