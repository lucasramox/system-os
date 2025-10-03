import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateOrderPayload } from './interface/update-order-service.interface';
import { CreateOrderPayload } from './interface/create-order-service.interface';

@Injectable()
export class OrderServiceService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: CreateOrderPayload) {
    return this.prisma.orderService.create({
      data: {
        title: String(Math.floor(Math.random() * 100000)).padStart(5, '0'),
        description: data.description,
        user: { connect: { id: data.userId } },
        checklist: {
          create: data.checklist.map((item) => ({
            label: item.label,
            checked: item.checked,
          })),
        },
        photos: {
          create: data.photos.map((photo) => ({
            url: photo.url,
          })),
        },
      },
      include: {
        checklist: true,
        photos: true,
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.orderService.findMany({
      where: { userId },
      include: {
        checklist: true,
        photos: true,
      },
    });
  }

  async findAllOrders(userId: number) {
    return this.prisma.orderService.findMany({
      where: { userId: userId },
      select: {
        title: true,
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(orderId: number) {
    return this.prisma.orderService.findUnique({
      where: { id: orderId },
      include: {
        checklist: true,
        photos: true,
      },
    });
  }

  async updateOrder(data: UpdateOrderPayload) {
    return this.prisma.orderService.update({
      where: { id: data.orderId },
      data: {
        title: data.title,
        description: data.description,
        checklist: data.checklist
          ? {
              deleteMany: { orderId: data.orderId },
              create: data.checklist.map((item) => ({
                label: item.label,
                checked: item.checked,
              })),
            }
          : undefined,
        photos:
          data.photos !== undefined
            ? {
                deleteMany: { orderId: data.orderId },
                create: data.photos.map((photo) => ({
                  url: photo.url,
                })),
              }
            : undefined,
      },
      include: {
        checklist: true,
        photos: true,
      },
    });
  }

  async getUserOrderStats(userId: number) {
    const orders = await this.prisma.orderService.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const ordersByMonth = orders.reduce((acc: any, order) => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear]++;

      return acc;
    }, {});

    const chartData = Object.entries(ordersByMonth).map(([month, count]) => ({
      month,
      count,
    }));

    return {
      total: orders.length,
      chartData,
    };
  }

  async deleteOrder(orderId: number) {
    return this.prisma.orderService.delete({
      where: { id: orderId },
    });
  }
}
