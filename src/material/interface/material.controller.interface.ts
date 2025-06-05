import { MaterialRequestDto } from "../dto/material-resquest.dto";
import { MaterialResponseDto } from "../dto/material-response.dto";
import { Response } from 'express';

export interface IMaterialController {
    createMaterial(
        materialResponse: MaterialRequestDto,
        user: number,
        file: Express.Multer.File,
    ): Promise<number>;

    findManyMaterial(idCourse: string): Promise<MaterialResponseDto[]>;

    findOneMaterial(id: string, res: Response): Promise<void>;

    deleteMaterial(id: string): Promise<void>;
} 