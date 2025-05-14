import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, HttpCode, HttpStatus, UseGuards, Query, UploadedFile, Logger, Res, NotFoundException } from '@nestjs/common';
import { MaterialService } from './material.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiResponse, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { MaterialPaginationResponseDto } from './dto/material-pagination-response.dto';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { handleHttpError } from 'src/utils/handle-http.error';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { multerFileOptions } from 'src/upload/helper/multer-file-options.helper';
import { FindMaterialDto } from './dto/find-material-dto';
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
  @UseInterceptors(FileInterceptor('file', multerFileOptions(' ./uploads/materials', /^image\/(jpeg|png|jpg|webp)$/)))
  async createMaterial(
    @Body() materialResponse: MaterialRequestDto,
    @CurrentUser() user: {id: number},
    @UploadedFile() file: Express.Multer.File,
  ): Promise<number> {
    try {
      return await this.materialService.createMaterial(materialResponse, user, file);
    } catch( error ) {

      this.logger.error(`Error to create a Material `, error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Find many Materials' })
  @ApiResponse({ status: 200, description: 'Success', type: MaterialPaginationResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findManyMaterial(@Query() query: FindMaterialDto
    ): Promise<MaterialPaginationResponseDto> {
    try {
      return await this.materialService.findManyMaterial(query);
    } catch(error) {
      this.logger.error('Error in find the Materials', error)
      handlePrismaError(error);
      handleHttpError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-one/:idMaterial')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Find One Material' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'idMaterial', type: String, description: 'ID Material'})
  async findOneMaterial(
    @Param('idMaterial') id: string,
    @Res() res: Response,
  ) {
    try {
      const material = await this.materialService.findOneMaterial(+id);

      if(!material.filename) {
        throw new NotFoundException('This material has no file available for download.');
      }

      const filePath = join(process.cwd(), 'uploads', 'materials', material.filename);
      return res.download(filePath, material.filename);
    } catch(error) {

      this.logger.error(`Failed to download file for material with ID ${id}`, error)
      handlePrismaError(error);
      handleHttpError(error);
    }
    
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idMaterial')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete Material' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'idMaterial', type: String, description: 'ID Material'})
  async deleteMaterial(@Param('idMaterial') id: string): Promise<void> {
    try {
      await this.materialService.deleteMaterial(+id);
    } catch (error) {

      this.logger.error('Error deleting material:', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
}
