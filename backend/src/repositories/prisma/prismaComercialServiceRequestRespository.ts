import { Injectable } from '@nestjs/common';
import { CommercialServiceRequestRepository } from '../commercialServiceRequestRepository';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PrismaCommercialPrismaServiceRequestRepository
  implements CommercialServiceRequestRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async addNewServiceRequest(userId: string, ticketId: number) {
    await this.prisma.commercialServiceRequest.create({
      data: {
        id: randomUUID(),
        createdAt: new Date(),
        ticketId: ticketId,
        userId: userId,
      },
    });
  }
}
