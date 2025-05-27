import { UserAutResDto } from '../dto/response/user-auth.response.dto';

export interface IUserService {
  findByUsernameOrEmailForAuth(usernameOrEmail: string): Promise<UserAutResDto>;
  findStudentByIdUser(idUser: number): Promise<number>;
}
