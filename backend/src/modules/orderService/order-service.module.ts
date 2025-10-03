import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';


@Module({
	controllers: [OrderServiceController],
	providers: [OrderServiceService, PrismaService],
})
export class OrderServiceModuleModule {}
