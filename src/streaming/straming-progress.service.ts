import { Injectable, Logger } from "@nestjs/common";
import { GetEnrolledCourseInfoService } from "src/enrollment/get-enrolled-course-info.service";
import { PrismaService } from 'src/prisma/prisma.service';
import { handleAppError } from "src/utils/handle-app-error.error";

@Injectable()
export class StreamingProgressService {
    private readonly logger = new Logger(StreamingProgressService.name);
    constructor (
        private readonly prisma: PrismaService,
        private readonly getEnrolledCourseInfoService: GetEnrolledCourseInfoService
    ) {}

    async createProgressVideo (idCourse: number, idVideo: number, idUser: number, progressVideo: number): Promise<boolean>{
        try {
            const idEnrrolment = await this.getEnrolledCourseInfoService.getEnrrolmentByIdCourseAndIdStudent(idCourse, idUser)
            const data = await this.prisma.progressVideo.create({
                data: {
                    idVideo,
                    idEnrrolment,
                    viewed : progressVideo
                }
            });
            return !!data;
        } catch (error) {
            this.logger.error(`Failed to create video progress`, error);
            handleAppError(error);
        }
    }

    async updateProgressVideo (idProgressVideo: number, progressVideo: number): Promise<boolean> {
        try {
            const data = await this.prisma.progressVideo.update({
                where: {id: idProgressVideo},
                data: {viewed : progressVideo}
            });
            return !!data;
        } catch (error) {
            this.logger.error(`Failed to update video progress`, error);
            handleAppError(error);
        }
    }
}