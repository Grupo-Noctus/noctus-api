import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsString } from "class-validator"

export class ModuleRequstDto {
    @IsInt()
    @ApiProperty({
        example: '1',
        description: 'id of course'
    })
    idCourse: number

    @IsString()
    @ApiProperty({
        example: 'Full-stack Web development',
        description: 'Name of module'
    })
    name: string

    @IsString()
    @ApiProperty({
        example: 'Full-Stack Web Development course covering frontend and backend technologies.',
        description:'Description of module of course'
    })
    description: string

    @IsInt()
    @ApiProperty({
        example: '1',
        description: 'Order of module in the course'
    })
    order: number
}