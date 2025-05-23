import { LoginRequestDto } from '../dto/request/login.request.dto';
import { UserRegisterDto } from '../dto/request/user-register.request.dto';
import { StudentRegisterDto } from '../dto/request/student-register.request.dto';

export abstract class IAuthService {
    abstract signIn(login: LoginRequestDto): Promise<{ access_token: string }>;

    abstract registerAdmin(
        userRegister: UserRegisterDto,
        image: string
    ): Promise<boolean>;

    abstract registerStudent(
        userRegister: UserRegisterDto,
        studentRegister: StudentRegisterDto,
        image?: string
    ): Promise<boolean>;
}
