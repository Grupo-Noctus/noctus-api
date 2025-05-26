import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ModuleRequstDto } from './dto/request/module-request.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ModuleResponseDto } from './dto/response/module-response.dto';
import { IModuleService } from './interface/module.interface';
import { ModuleUpdateDto } from './dto/update/module-update.dto';
import { EnrollmentGuard } from 'src/auth/guard/enrrolment.guard';

@ApiTags('Module')
@Controller('module')
@Roles(Role.ADMIN)
@UseGuards(EnrollmentGuard)
export class ModuleController {
  constructor(
    @Inject('IModuleService')
    private readonly moduleService: IModuleService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create/:idCourse')
  @ApiOperation({ summary: 'Created Module of course' })
  @ApiResponse({ status: 200, description: 'Success', type: Boolean })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'idCourse', type: String, description: 'ID of course of module' })
  async createModule(
    @Param('idCourse', ParseIntPipe) idCourse: number,
    @Body() moduleRequst: ModuleRequstDto,
    @CurrentUser() user: number,
  ): Promise<boolean> {
    return await this.moduleService.createModule(idCourse, moduleRequst, user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Module of course' })
  @ApiResponse({ status: 200, description: 'Success', type: Boolean })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Put('update/:idModule')
  async updateModule(
    @Param('idModule', ParseIntPipe) idModule: number,
    @Body() updateModule: ModuleUpdateDto,
    @CurrentUser() user: number,
  ): Promise<boolean> {
    return await this.moduleService.updateModule(idModule, updateModule, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find-many/:idCourse')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Find many modules of course' })
  @ApiResponse({ status: 200, description: 'Success', type: [ModuleResponseDto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findManyModule(
    @Param('idCourse', ParseIntPipe) idCourse: number,
    @Query('idEnrollment') idEnrollment: number,
    @CurrentUser() user: number,
    @CurrentUser('role') role: Role,
  ): Promise<ModuleResponseDto[] | []> {
    if (role === Role.STUDENT && !idEnrollment) {
      throw new BadRequestException('idEnrollment is required for students');
    }
    return await this.moduleService.findModulesWithVideos(idCourse, idEnrollment, user, role);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Find One Module of course' })
  @ApiResponse({ status: 200, description: 'Success', type: ModuleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('find-one/:idModule')
  async findOneModule(
    @Param('idModule', ParseIntPipe) idModule: number,
  ): Promise<ModuleResponseDto> {
    return await this.moduleService.findOneModule(idModule);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:idModule')
  @ApiOperation({ summary: 'Delete module of course' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deletemodule(@Param('idModule', ParseIntPipe) idModule: number): Promise<void> {
    await this.moduleService.deleteModule(idModule);
  }
}
