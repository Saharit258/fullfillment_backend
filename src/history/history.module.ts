import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { history } from 'src/entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([history])],
  providers: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
