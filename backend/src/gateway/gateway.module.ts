import { Module } from '@nestjs/common';
import { SocketGateway } from './gateway';
import { GatewayService } from './services/gateway.service';
import { UserRepository } from 'src/repositories/userRepository';
import { PrismaUserRepository } from 'src/repositories/prisma/prismaUserRepository';
import { PrismaService } from 'src/database/prisma.service';
import { TicketRepository } from 'src/repositories/ticketRepository';
import { PrismaTicketRepository } from 'src/repositories/prisma/prismaTicketRepository';
import { MessageRepository } from 'src/repositories/messageRepository';
import { PrismaMessageRepository } from 'src/repositories/prisma/prismaMessageRepository';
import { CommercialServiceRequestRepository } from 'src/repositories/commercialServiceRequestRepository';
import { PrismaCommercialPrismaServiceRequestRepository } from 'src/repositories/prisma/prismaComercialServiceRequestRespository';
import { MaintenanceServiceRequestRepository } from 'src/repositories/maintenanceServiceRequestRepository';
import { PrismaMaintenanceServiceRequestRepository } from 'src/repositories/prisma/prismaMaintenanceServiceRequestRepository';

@Module({
  providers: [
    SocketGateway,
    GatewayService,
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: TicketRepository,
      useClass: PrismaTicketRepository,
    },
    {
      provide: MessageRepository,
      useClass: PrismaMessageRepository,
    },
    {
      provide: CommercialServiceRequestRepository,
      useClass: PrismaCommercialPrismaServiceRequestRepository,
    },
    {
      provide: MaintenanceServiceRequestRepository,
      useClass: PrismaMaintenanceServiceRequestRepository,
    },
  ],
})
export class GatewayModule {}
