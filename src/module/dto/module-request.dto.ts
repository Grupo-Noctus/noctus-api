import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsString } from "class-validator"

export class ModuleRequstDto {
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
}