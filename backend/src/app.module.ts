import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [GatewayModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
