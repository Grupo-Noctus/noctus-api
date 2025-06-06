import { Module } from '@nestjs/common';
import { EventsGateway } from './chat-gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';

@Module({
    providers: [EventsGateway, PrismaService, ChatService]
})
export class ChatModule {}
