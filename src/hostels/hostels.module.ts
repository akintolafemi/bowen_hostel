import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HostelsController } from './hostels.controller';
import { HostelsService } from './hostels.service';

@Module({
  controllers: [HostelsController],
  providers: [HostelsService, PrismaService]
})
export class HostelsModule {}
