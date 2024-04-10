import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { Item } from './entities/item.entity';
import { History } from './entities/history.entity';
import { HistoryOrder } from './entities/historyorder.entity';
import { Stores } from './entities/stores.entity';
import { Order } from './entities/order.entity';
import { OrderNo } from './entities/orderno.entity';
import { LotModule } from './lot/lot.module';
import { ItemModule } from './item/item.module';
import { HistoryModule } from './history/history.module';
import { StoresModule } from './stores/stores.module';
import { OrderModule } from './order/order.module';
import { OrdernoModule } from './orderno/orderno.module';
import { HistoryOrderModule } from './history-order/history-order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'newfullfillment',
      entities: [Lot, Item, History, Stores, Order, OrderNo, HistoryOrder],
      synchronize: true,
    }),

    LotModule,

    ItemModule,

    HistoryModule,

    StoresModule,

    OrderModule,

    OrdernoModule,

    HistoryOrderModule,
  ],
})
export class AppModule {}
