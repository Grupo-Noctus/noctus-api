import { EnrolledCourseDto } from "../dto/response/enrolled-course.response.dto";

export interface IEnrolledCourseService{
    findCoursesPerEnrollment (user: number): Promise<EnrolledCourseDto[] | []>
    getEnrrolmentByIdCourseAndIdStudent (idCourse: number, idUser: number): Promise<number>
}