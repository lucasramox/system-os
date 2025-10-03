import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OrderServiceModuleModule } from './modules/orderService/order-service.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './comon/guards/jwt-auth.guard';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    OrderServiceModuleModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
