import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrdernoService } from '../orderno/orderno.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderNo } from '../entities/orderno.entity';
import { item } from '../entities/item.entity';
import { history } from '../entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderNo, item, history])],
  controllers: [OrderController],
  providers: [OrderService, OrdernoService],
})
export class OrderModule {}
