import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
  UploadedFile,
  Logger,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiResponse, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { MaterialResponseDto } from './dto/material-response.dto';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { handleAppError } from 'src/utils/handle-app-error.error';
import { multerFileOptions } from 'src/upload/helper/multer-file-options.helper';
import { join } from 'path';
import { Response } from 'express';

@ApiTags('Material')
@Controller('material')
@UseGuards(AuthGuard)
export class MaterialController {
  private readonly logger = new Logger(MaterialController.name);
  constructor(private readonly materialService: MaterialService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create Material' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerFileOptions(
        './uploads/materials',
        /^image\/(jpeg|png|jpg|webp)$|^application\/pdf$|^application\/msword$|^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/,
      ),
    ),
  )
  async createMaterial(
    @Body() materialResponse: MaterialRequestDto,
    @CurrentUser() user: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<number> {
    try {
      const blockedExtensions = ['.exe', '.sh', '.bat', '.cmd'];

      if (blockedExtensions.some(ext => file.originalname.endsWith(ext))) {
        throw new BadRequestException('File type not allowed');
      }
      return await this.materialService.createMaterial(materialResponse, user, file);
    } catch (error) {
      this.logger.error(`Error to create a Material `, error);
      handleAppError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many/:idCourse')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Find many Materials by IdCourse' })
  @ApiResponse({ status: 200, description: 'Success', type: [MaterialResponseDto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findManyMaterial(@Param('idCourse') idCourse: string): Promise<MaterialResponseDto[]> {
    try {
      return await this.materialService.findManyMaterial({ idCourse: +idCourse });
    } catch (error) {
      this.logger.error('Error in find the Materials', error);
      handleAppError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-one/:idMaterial')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Find One Material' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'idMaterial', type: String, description: 'ID Material' })
  async findOneMaterial(@Param('idMaterial') id: string, @Res() res: Response) {
    try {
      const material = await this.materialService.findOneMaterial(+id);

      if (!material.filename) {
        throw new NotFoundException('This material has no file available for download.');
      }

      const filePath = join(process.cwd(), 'uploads', 'materials', material.filename);
      return res.download(filePath, material.filename);
    } catch (error) {
      this.logger.error(`Failed to download file for material with ID ${id}`, error);
      handleAppError(error);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idMaterial')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete Material' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'idMaterial', type: String, description: 'ID Material' })
  async deleteMaterial(@Param('idMaterial') id: string): Promise<void> {
    try {
      await this.materialService.deleteMaterial(+id);
    } catch (error) {
      this.logger.error('Error deleting material:', error);
      handleAppError(error);
    }
  }
}
