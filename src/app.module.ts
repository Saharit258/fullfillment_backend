import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lot } from './entities/lot.entity';
import { item } from './entities/item.entity';
import { history } from './entities/history.entity';
import { Stores } from './entities/stores.entity';
import { Order } from './entities/order.entity';
import { OrderNo } from './entities/orderno.entity';
import { LotModule } from './lot/lot.module';
import { ItemModule } from './item/item.module';
import { HistoryModule } from './history/history.module';
import { StoresModule } from './stores/stores.module';
import { OrderModule } from './order/order.module';
import { OrdernoModule } from './orderno/orderno.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'fullfillment',
      entities: [lot, item, history, Stores, Order, OrderNo],
      synchronize: true,
    }),

    LotModule,

    ItemModule,

    HistoryModule,

    StoresModule,

    OrdernoModule,
  ],
})
export class AppModule {}
