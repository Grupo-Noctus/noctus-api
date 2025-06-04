import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JoinRoomDto } from './dto/join-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    port: 8082,
})
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly prisma: PrismaService,
        private readonly chatService: ChatService
    ) {}

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinCourse')
    async onJoinCourse(
        @MessageBody() data: JoinRoomDto,
        @ConnectedSocket() client: Socket,
    ){
        await this.chatService.handleJoinCourse(data, client)
    }

    @SubscribeMessage('sendMessage')
    async onSendMessage(
        @MessageBody() data: SendMessageDto,
        @ConnectedSocket() client: Socket,
    ){

    const response = await this.chatService.handleSendMessage(data, client);
    const roomName = `course_${data.courseId}`;

    if (response.success) {
      
      client.to(roomName).emit('newMessage', response.message);

      client.emit('newMessage', response.message);
    } else {
      client.emit('error', response.error);
    }
    }

    @SubscribeMessage('leaveCourse')
    async onLeaveCourse(
        @MessageBody() data: JoinRoomDto,
        @ConnectedSocket() client: Socket,
    ){
        await this.chatService.handleLeaveCourse(data, client);
    }

    
    

}