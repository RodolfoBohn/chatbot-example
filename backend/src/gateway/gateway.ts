import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { GatewayService } from './services/gateway.service';
import { UserRepository } from 'src/repositories/userRepository';
import { TicketRepository } from 'src/repositories/ticketRepository';

import { IMessageProps, IUserProps } from 'src/@types/types';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  },
})
@Injectable()
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly userRepository: UserRepository,
    private readonly ticketRepository: TicketRepository,
  ) {}

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      let user: IUserProps;
      const userId = socket.handshake.query.userId as string;

      if (userId) {
        user = await this.userRepository.findByCountId(userId);
      } else {
        const createdUser: IUserProps = await this.userRepository.create();
        user = createdUser;
        socket.emit('createUser', {
          userId: createdUser.countId,
        });
      }

      if (!user) {
        const createdUser: IUserProps = await this.userRepository.create();
        user = createdUser;
        socket.emit('createUser', {
          userId: createdUser.countId,
        });
      }
      let ticket = await this.ticketRepository.findActiveByUserId(user?.id);

      if (!ticket) {
        ticket = await this.ticketRepository.create(user.id);
      }

      socket.emit('response', ticket.message);
    });
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(
    @ConnectedSocket() clientInformation: Socket,
    @MessageBody() body: IMessageProps,
  ) {
    const responseMessage = await this.gatewayService.manageMessage(
      body,
      clientInformation.handshake.query.userId as string,
    );

    clientInformation.emit('response', responseMessage);
  }
}
