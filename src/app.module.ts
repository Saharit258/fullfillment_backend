import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lot } from './endtiter/lot.entity';
import { item } from './endtiter/item.entity';
import { history } from './endtiter/history.entity';
import { LotModule } from './lot/lot.module';
import { ItemModule } from './item/item.module';
import { HistoryModule } from './history/history.module';
import { TestModule } from './test/test.module';

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

    TestModule,
  ],
})
export class AppModule {}
