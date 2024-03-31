import { Injectable } from '@nestjs/common';
import { MaintenanceServiceRequestRepository } from '../maintenanceServiceRequestRepository';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { IMaintenanceProps } from 'src/@types/types';

@Injectable()
export class PrismaMaintenanceServiceRequestRepository
  implements MaintenanceServiceRequestRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async addNewServiceRequest(
    userId: string,
    ticketId: number,
    scheduledDate: Date,
  ) {
    await this.prisma.maintenanceServiceRequest.create({
      data: {
        id: randomUUID(),
        createdAt: new Date(),
        scheduledDate: scheduledDate,
        ticketId: ticketId,
        userId: userId,
      },
    });
  }

  async getAllScheduledBetweenDates(
    initialDate: Date,
    finishedDate: Date,
  ): Promise<IMaintenanceProps[]> {
    return await this.prisma.maintenanceServiceRequest.findMany({
      where: {
        scheduledDate: {
          gte: initialDate,
          lte: finishedDate,
        },
      },
    });
  }

  async finbByScheduledDate(date: Date): Promise<IMaintenanceProps | null> {
    return await this.prisma.maintenanceServiceRequest.findFirst({
      where: {
        scheduledDate: date,
      },
    });
  }
}
