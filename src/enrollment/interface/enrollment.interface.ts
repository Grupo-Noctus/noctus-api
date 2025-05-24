import { PreEnrollmentDto } from "../dto/request/pre-enrollment.request.dto";
import { EnrollmentRequestDto } from "../dto/request/enrollment.request.dto";
import { EnrollmentPaginationResponseDto } from "../dto/response/enrollment-pagination.response.dto";
import { EnrollmentResponseDto } from "../dto/response/enrollment.response.dto";
import { EnrollmentUpdateDto } from "../dto/update/enrollment.update.dto";

export interface IEnrollmentService{
    createEnrollment(enrrolement: EnrollmentRequestDto, user: number): Promise<boolean>
    createPreEnrollment(idCourse: number,enrrolements: PreEnrollmentDto, user: number): Promise<boolean>
    createEnrollmentByPreEnrrolment(student: number, userEmail: string): Promise<void>
    getEnrollmentById(id: number): Promise<EnrollmentResponseDto>
    updateEnrollment(idEnrollment: number, updateEnrollment: EnrollmentUpdateDto, user: number): Promise<boolean>
    deleteEnrollment(idEnrollment: number): Promise<void>
    findManyEnrollment(pageNumber: number): Promise<EnrollmentPaginationResponseDto>
}