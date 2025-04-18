import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ModuleRequstDto } from './dto/module-request.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ModuleResponseDto } from './dto/module-response.dto';

@ApiTags('Module')
@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Created Module of course'})
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @Post('create')
  async createModule(
    @Body() moduleRequst: ModuleRequstDto, 
    @CurrentUser() user: number
  ): Promise<boolean>{
    return await this.moduleService.createModule(moduleRequst, user);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update Module of course'})
  @ApiResponse({ status: 200, description:'Success', type: Boolean})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @Put('update/:idModule')
  async updateModule(
    @Param('idModule') idModule: string,
    @Body() updateModule: ModuleRequstDto,
    @CurrentUser() user: number
  ): Promise <boolean>{
    return await this.moduleService.updateModule(+idModule, updateModule, user);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find One Module of course'})
  @ApiResponse({ status: 200, description:'Success', type: ModuleResponseDto})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @Get('find-one/:idModule')
  async findOneModule(@Param('idModule') idModule: string): Promise<ModuleResponseDto>{
    return await this.moduleService.findOneModule(+idModule);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idModule')
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Delete module of course'})
  @ApiResponse({ status: 200, description:'Success'})
  @ApiResponse({status:400, description: 'Bad Request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async deleteCourse(@Param('idModule') idModule: string): Promise<void> {
    await this.moduleService.deleteCourse(+idModule);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many/:idCourse')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({summary: 'Find many modules of course'})
  @ApiResponse({ status: 200, description:'Success', type: [ModuleResponseDto]})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 404, description: 'Not Found'})
  async findManyCourse(@Param('idCourse')idCourse: string): Promise<ModuleResponseDto[] | []> {
    return await this.moduleService.findManyModule(+idCourse);
  } 
}
