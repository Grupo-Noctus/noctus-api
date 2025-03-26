import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('material')
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

  @Patch('update/:id')
  updateMaterial(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialService.update(+id, updateMaterialDto);
  }

  @Delete('delete/:id')
  removeMaterial(@Param('id') id: string) {
    return this.materialService.remove(+id);
  }
}
