import { MaterialRequestDto } from "../dto/material-resquest.dto";
import { MaterialResponseDto } from "../dto/material-response.dto";
import { Material } from "@prisma/client";

export interface IMaterialService {
    createMaterial(
        materialRequest: MaterialRequestDto,
        user: number,
        file: Express.Multer.File,
    ): Promise<number>;

    findManyMaterial(idCourse: number): Promise<MaterialResponseDto[]>;

    findOneMaterial(id: number): Promise<Material>;
    findOneMaterial(id: number, withMetadata: true): Promise<{ material: Material; fileMetadata: string }>;

    deleteMaterial(id: number): Promise<void>;
}