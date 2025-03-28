import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('material')
//@UseGuards(AuthGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadMaterial(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  @Get('get')
  findAllMaterial() {
    return this.materialService.findAll();
  }

  @Get('get/:id')
  findOneMaterial(@Param('id') id: string) {
    return this.materialService.findOne(+id);
  }

  @Delete('delete/:id')
  removeMaterial(@Param('id') id: string) {
    return this.materialService.remove(+id);
  }
}
