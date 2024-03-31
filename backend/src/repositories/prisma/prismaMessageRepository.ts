import { IMessageProps } from 'src/@types/types';
import { MessageRepository } from '../messageRepository';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addNewMessage(
    message: IMessageProps,
    ticketId: number,
  ): Promise<IMessageProps> {
    const options = message.MessageOptions?.map((option) => ({
      id: randomUUID(),
      text: option.optionText,
      value: option.value,
    }));

    return options?.length > 0
      ? await this.prisma.message.create({
          data: {
            id: randomUUID(),
            createdAt: new Date(),
            sender: message.sender,
            content: message.content,
            ticketId: ticketId,
            MessageOption: {
              create: [...options],
            },
          },
        })
      : await this.prisma.message.create({
          data: {
            id: randomUUID(),
            createdAt: new Date(),
            sender: message.sender,
            content: message.content,
            ticketId: ticketId,
          },
        });
  }
}
