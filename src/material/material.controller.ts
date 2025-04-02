import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpCode, HttpStatus, UseGuards, Query, UploadedFile } from '@nestjs/common';
import { MaterialService } from './material.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MaterialPaginationResponseDto } from './dto/material-pagination-response.dto';
import { MaterialRequestDto } from './dto/material-resquest.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { diskStorage } from 'multer'
import { extname } from 'path';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { Public } from  'src/auth/decorator/public.decorator'

@ApiTags('Material')
@Controller('material')
@UseGuards(AuthGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}


  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Create Material'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async createMaterial(
    @Body() courseResponse: MaterialRequestDto,
    @CurrentUser() user: number,
    @UploadedFile() file: Express.Multer.File, 
  ): Promise<boolean> {
      return await this.materialService.createMaterial(courseResponse, user, file);
    }

  @HttpCode(HttpStatus.OK)
  @Get('find-many')
  @Public()
  @ApiOperation({summary: 'Find many Materials'})
  @ApiResponse({ status: 200, description:'Success', type: MaterialPaginationResponseDto})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async findManyMaterial(@Query() page: number): Promise<MaterialPaginationResponseDto> {
    return await this.materialService.findManyMaterial(page);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-one/:id')
  @Public()
  @ApiOperation({summary: 'Find One Material'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  findOneMaterial(@Param('id') id: string) {
    return this.materialService.findOneMaterial(+id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: ' Delete Material'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  async deleteMaterial(@Param('id') id: string): Promise<void> {
    await this.materialService.deleteMaterial(+id);
  }
}
