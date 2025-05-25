import { Role } from "@prisma/client";
import { CourseRequestDto } from "../dto/request/course.request.dto";
import { CoursePaginationResponseDto } from "../dto/response/course-pagination.response.dto";
import { coursePreviewDto } from "../dto/response/course-preview.response";
import { CourseResponseDto } from "../dto/response/course.response.dto";
import { CourseUpdateDto } from "../dto/update/course.update.dto";

export interface ICourseService {
  createCourse(courseRequest: CourseRequestDto, user: number, image: string): Promise<boolean>;
  updateCourse(idCourse: number, updateCourse: CourseUpdateDto, user: number, image?: string): Promise<boolean>;
  toggleCourseVisibility(idCourse: number): Promise<void>;
  findOneCoursePreview(idCourse: number, user: number, role: Role): Promise<coursePreviewDto>;
  findManyCoursePagination(limit: number, page: number, user: number, role: Role): Promise<CoursePaginationResponseDto>;
}