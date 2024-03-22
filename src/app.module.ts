import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lot } from './entities/lot.entity';
import { item } from './entities/item.entity';
import { history } from './entities/history.entity';
import { LotModule } from './lot/lot.module';
import { ItemModule } from './item/item.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'fullfillment',
      entities: [lot, item, history],
      synchronize: true,
    }),

    LotModule,

    ItemModule,

    HistoryModule,
  ],
})
export class AppModule {}
