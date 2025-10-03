import {
  Controller,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { OrderServiceService } from './order-service.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateOrderServiceDto } from './dtos/create-order-service.dto';
import { UpdateOrderServiceDto } from './dtos/update-order-service.dto';

@Controller('orders')
export class OrderServiceController {
  constructor(private readonly orderService: OrderServiceService) {}

  @Post(':userId')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async createOrder(
    @Param('userId') userId: number,
    @Body() body: CreateOrderServiceDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    const checklist = JSON.parse(body.checklist);

    return this.orderService.createOrder({
      userId,
      description: body.description,
      checklist,
      photos: photos.map((file) => ({
        url: `/uploads/${file.filename}`,
      })),
    });
  }

  @Get(':userId')
  async listOrders(@Param('userId') userId: number) {
    return this.orderService.findAllOrders(userId);
  }

  @Get('detail/:id')
  async getOrderById(@Param('id') id: number) {
    const order = await this.orderService.findById(id);
    if (!order) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }
    return order;
  }

@Put(':orderId')
@UseInterceptors(
  FilesInterceptor('photos', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }),
)
async updateOrder(
  @Param('orderId') orderId: number,
  @Body() body: UpdateOrderServiceDto,
  @UploadedFiles() photos: Express.Multer.File[],
) {
  const checklist = body.checklist ? JSON.parse(body.checklist) : undefined;
  const existingPhotos = body.existingPhotos ? JSON.parse(body.existingPhotos) : [];
  
  const allPhotos = [
    ...existingPhotos.map((p: any) => ({ url: p.url })),
    ...(photos || []).map((file) => ({ url: `/uploads/${file.filename}` })),
  ];

  return this.orderService.updateOrder({
    orderId,
    description: body.description,
    checklist,
    photos: allPhotos,
  });
}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrderById(@Param('id') id: number) {
    try {
      await this.orderService.deleteOrder(id);
      return { message: 'Ordem de serviço deletada com sucesso' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Ordem de serviço não encontrada');
      }
      throw error;
    }
  }

  @Get('control/user/:userId')
  async getUserOrderStats(@Param('userId') userId: number) {
    return this.orderService.getUserOrderStats(userId);
  }
}
