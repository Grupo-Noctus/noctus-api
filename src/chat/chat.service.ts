import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { MessageStructure } from './interface/chat-interface';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async handleJoinCourse(data: JoinRoomDto, client: Socket): Promise<void> {
    const roomName = `course_${data.courseId}`;
    await client.join(roomName);

    console.log(`User ${data.userName} joined course ${data.courseId}`);

    const courseMessages = await this.prisma.message.findMany({
      where: { courseId: Number(data.courseId) },
      orderBy: { time: 'asc' }
    });

    const formattedMessages: MessageStructure[] =  courseMessages.map(msg => ({
      id: msg.id,
      message: msg.message,
      time: msg.time.toISOString(),
      userName: msg.userName,
      admin: msg.admin
    }));

    client.emit('courseMessages', formattedMessages);
  }

  async handleSendMessage(data: SendMessageDto, client: Socket){
    try {
      const savedMessage = await this.prisma.message.create({
        data: {
          message: data.message,
          userName: data.userName,
          admin: data.admin,
          courseId: Number(data.courseId),
          time: new Date(),
          }
      });

      const formattedMessage: MessageStructure = {
          id: savedMessage.id,
          message: savedMessage.message,
          time: savedMessage.time.toISOString(),
          userName: savedMessage.userName,
          admin: savedMessage.admin
      };

      const roomName = `course_${data.courseId}`;

      console.log(`Message sent to course ${data.courseId}:`, formattedMessage);

      return { success: true, message: formattedMessage };
    } catch (error) {
        console.error('Error saving message:', error);
        return { success: false, error: 'Failed to send message' };
      }
    }

    async handleLeaveCourse(data: JoinRoomDto, client: Socket) {
      const roomName = `course_${data.courseId}`;
      await client.leave(roomName);
      console.log(`User ${data.userName} left course ${data.courseId}`);
  }

}
