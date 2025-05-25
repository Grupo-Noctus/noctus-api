import { Role } from "@prisma/client";
import { EnrolledCourseDto } from "../dto/response/enrolled-course.response.dto";

export interface IEnrolledCourseService{
    findCoursesPerEnrollment (user: number, role: Role): Promise<EnrolledCourseDto[] | []>
}