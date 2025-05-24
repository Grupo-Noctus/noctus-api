import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service";
import { EnrolledCourseDto } from "./dto/response/enrolled-course.response.dto";
import { handleAppError } from "src/utils/handle-app-error.error";
import { UserService } from "src/user/user.service";
import { Prisma } from "@prisma/client";
import { IEnrolledCourseService } from "./interface/enrolled-course.interface";

@Injectable()
export class EnrolledCourseService implements IEnrolledCourseService{
    private readonly logger = new Logger(EnrolledCourseService.name)
    
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
    ) {}

    async findCoursesPerEnrollment (user: number): Promise<EnrolledCourseDto[] | []> {
        try {
            const enrrolmentsAndCourses = await this.prisma.$queryRaw<EnrolledCourseDto[]>
            (Prisma.sql`
                SELECT 
                c.id AS courseId, 
                c.name AS courseName, 
                c.description AS courseDescription, 
                c.image AS courseImage, 
                c.duration,
                e.expiresAt,
                e.id AS enrollmentId, 
                e.active, 
                e.completed 
                FROM User u 
                INNER JOIN Student s ON u.id  = s.idUser
                INNER JOIN Enrollment e ON e.idStudent = s.id
                INNER JOIN Course c ON c.id = e.idCourse
                WHERE u.id = ${user};
            `);
            
            if (enrrolmentsAndCourses.length === 0) {
                return [];
            }
            
            return enrrolmentsAndCourses;
        } catch (error) {
            this.logger.error('Error fetching courses: ', error);
            throw handleAppError(error);
        }    
    }

    async getEnrrolmentByIdCourseAndIdStudent (idCourse: number, idUser: number): Promise<number>{
        try {
            const idStudent = await this.userService.findStudentByIdUser(idUser);
            const data = await this.prisma.enrollment.findUnique({
                where: {
                    idStudent_idCourse: {
                        idStudent,
                        idCourse,
                    },
                },
                select: {
                    id: true,
                }
            });
            if (!data) {
                this.logger.error('Enrollment not found');
                throw new NotFoundException('Enrollment not found');
            }
            return data.id;
        } catch (error) {
           this.logger.error('Error fetching enrrolement: ', error);
            throw handleAppError(error);
        }
    }
}