import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModuleRequstDto } from './dto/module-request.dto';
import { ModuleUpdateDto } from './dto/module-update.dto';
import { ModuleResponseDto } from './dto/module-response.dto';

@Injectable()
export class ModuleService {
    constructor(
        private readonly prisma: PrismaService,
    ){}

    async verifyOrder(idCourse: number, order: number): Promise<boolean>{
        const orders = await this.prisma.module.findMany({
            where: {idCourse: idCourse},
            select: {order: true}
        });
        return orders.some(module => module.order === order);
    }

    async createModule(moduleRequest: ModuleRequstDto, user: number): Promise <boolean>{
        try{
            const {idCourse, ...restModule} = moduleRequest
            const isOrderUsed = await this.verifyOrder(idCourse, restModule.order);
            if(isOrderUsed){
                throw new BadRequestException('The module order is already being used.')
            }
            await this.prisma.module.create({
                data: {
                    course:{
                        connect: {id: moduleRequest.idCourse}
                    },
                    ...restModule,
                    createdBy: user,
                    updatedBy: user
                }
            });
            return true;
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Bad Resquest of module: ', error);
        }
    }

    async updateModule(idModule: number, moduleUpdate: ModuleUpdateDto, user: number): Promise<boolean>{
        try {
            await this.prisma.module.update({
                where: {id: idModule},
                data: {
                    ...moduleUpdate,
                    updatedBy: user,
                }
            })
            return true;
        }catch (error){
            console.error(error);
            throw new BadRequestException();
        }
    }

    async findOneModule(idModule: number): Promise<ModuleResponseDto>{
        try{
            return await this.prisma.module.findUnique({
                where: {id: idModule},
                select: {
                    name: true,
                    description: true,
                    order: true
                }
            });
        } catch (error) {
            console.error(error);
            throw new NotFoundException();
        }
    }

    async deleteCourse(idModule: number): Promise<void>{
        try {
            await this.prisma.module.delete({
                where: {id: idModule}
            });
        }catch(error){
            console.error(error);
            throw new NotFoundException();
        }
    }

    async findManyModule(idCourse: number): Promise<ModuleResponseDto[]>{
        try {
            const modules = await this.prisma.module.findMany({
                where: { idCourse: idCourse},
                select: {
                    name: true,
                    description: true,
                    order: true
                }
            });

            if(!modules || modules.length === 0){
                throw new NotFoundException('Not found modules to course.');
            }

            return modules;
        }catch (error){
            console.error(error);
            throw new NotFoundException();
        }
    }
}
