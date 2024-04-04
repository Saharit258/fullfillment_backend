import { Module } from '@nestjs/common';
import { HistoryOrderService } from './history-order.service';
import { HistoryOrderController } from './history-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryOrder } from '../entities/historyorder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryOrder])],
  controllers: [HistoryOrderController],
  providers: [HistoryOrderService],
})
export class HistoryOrderModule {}
