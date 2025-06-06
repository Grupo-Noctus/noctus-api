import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class JoinRoomDto{

    @IsInt()
    @ApiProperty({ description: 'Course ID', example: 123, type: Number, })
    courseId: number;

    @IsString()
    @ApiProperty({ description: 'Name of the user', example: "John Doe", type: String, })
    userName: string;
}