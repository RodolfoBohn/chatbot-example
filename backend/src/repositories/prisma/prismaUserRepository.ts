import { PrismaService } from 'src/database/prisma.service';
import { UserRepository } from '../userRepository';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { IUserProps } from 'src/@types/types';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(): Promise<IUserProps> {
    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        createtAt: new Date(),
        countId: randomUUID(),
      },
    });
    return user;
  }

  async findByCountId(countId: string): Promise<IUserProps> {
    const user = await this.prisma.user.findFirst({
      where: {
        countId: countId,
      },
    });

    return user;
  }
}
