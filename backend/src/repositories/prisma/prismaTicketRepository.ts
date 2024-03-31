import { PrismaService } from 'src/database/prisma.service';
import { TicketRepository } from '../ticketRepository';
import { ITicketProps } from 'src/@types/types';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTicketRepository implements TicketRepository {
  constructor(private prisma: PrismaService) {}

  async findById(ticketId: number): Promise<ITicketProps> {
    return await this.prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        message: {
          include: {
            MessageOption: true,
          },
        },
      },
    });
  }

  async create(userId: string): Promise<ITicketProps> {
    const ticket = await this.prisma.ticket.create({
      data: {
        createdAt: new Date(),
        state: 'INICIADO',
        user: {
          connect: {
            id: userId,
          },
        },
        message: {
          create: {
            id: randomUUID(),
            createdAt: new Date(),
            sender: 'bot',
            content: 'Seja bem-vindo! Selecione uma das opções a seguir:',
            MessageOption: {
              create: [
                {
                  id: randomUUID(),
                  text: '1 - Desejo adquirir um veículo',
                  value: '1',
                },
                {
                  id: randomUUID(),
                  text: '2 - Desejo agendar uma manutenção',
                  value: '2',
                },
              ],
            },
          },
        },
      },
      include: {
        message: {
          include: {
            MessageOption: true,
          },
        },
      },
    });
    return ticket;
  }

  async findActiveByUserId(userId: string): Promise<ITicketProps> {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        userId: userId,
        AND: {
          state: {
            notIn: ['FINALIZADO'],
          },
        },
      },
      include: {
        message: {
          include: {
            MessageOption: true,
          },
        },
      },
    });
    return ticket;
  }

  async findActiveByUserCountId(countId: string): Promise<ITicketProps> {
    return await this.prisma.ticket.findFirst({
      where: {
        user: {
          countId: countId,
        },
        AND: {
          state: {
            notIn: ['FINALIZADO'],
          },
        },
      },
    });
  }

  async updateTicketStatus(
    ticketId: number,
    status: string,
  ): Promise<ITicketProps> {
    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        state: status,
      },
    });
  }

  async closeTicket(ticketId: number): Promise<ITicketProps> {
    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        state: 'FINALIZADO',
        completedAt: new Date(),
        message: {
          create: {
            id: randomUUID(),
            createdAt: new Date(),
            sender: 'bot',
            content: `Atendimento finalizado. O código do seu atendimento é ${ticketId}. Para iniciar um novo, selecione a opção iniciar novo atendimento.`,
            MessageOption: {
              create: [
                {
                  id: randomUUID(),
                  text: 'Iniciar novo atendimento',
                  value: 'Iniciar novo atendimento',
                },
              ],
            },
          },
        },
      },
    });
  }
}
