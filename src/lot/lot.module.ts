import { Module } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lot } from 'src/entities/lot.entity';
import { history } from 'src/entities/history.entity';
import { item } from '../entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([lot, history, item])],
  providers: [LotService],
  controllers: [LotController],
})
export class LotModule {}
