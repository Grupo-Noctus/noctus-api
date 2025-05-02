import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, HttpCode, HttpStatus, UseGuards, Query, UploadedFile, NotFoundException } from '@nestjs/common';
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
import { MaterialResponseDto } from './dto/material-response.dto';
import { handlePrismaError } from 'src/utils/handle-prisma.error';
import { multerFileOptions } from 'src/upload/helper/multer-file-options.helper';

@ApiTags('Material')
@Controller('material')
@UseGuards(AuthGuard)
export class MaterialController {
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

      console.error(`Error to create a Material `, error);
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
  async findManyMaterial(@Query() page: number, material: MaterialResponseDto): Promise<MaterialPaginationResponseDto> {
    try {
      return await this.materialService.findManyMaterial(page);
    } catch(error) {
      if (!material || material.length === 0) {
        throw new NotFoundException('No courses found.');
      }

      console.error(`Error to find Materials `, error);
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
  async findOneMaterial(@Param('id') id: string) {
    try {
      return this.materialService.findOneMaterial(+id);
    } catch(error) {

      console.error(`Error to find a material: '${id}' `, error);
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
  async deleteMaterial(@Param('id') id: string): Promise<void> {
    try {
      await this.materialService.deleteMaterial(+id);
    } catch (error) {

      console.error('Error deleting material:', error);
      handlePrismaError(error);
      handleHttpError(error);
    }
  }
}
