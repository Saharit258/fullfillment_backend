import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lot } from './entities/lot.entity';
import { item } from './entities/item.entity';
import { history } from './entities/history.entity';
import { Stores } from './entities/stores.entity';
import { LotModule } from './lot/lot.module';
import { ItemModule } from './item/item.module';
import { HistoryModule } from './history/history.module';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'fullfillment',
      entities: [lot, item, history, Stores],
      synchronize: true,
    }),

    LotModule,

    ItemModule,

    HistoryModule,

    StoresModule,
  ],
})
export class AppModule {}
