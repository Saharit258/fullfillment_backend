import { Module } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lot } from 'src/endtiter/lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([lot])],
  providers: [LotService],
  controllers: [LotController],
})
export class LotModule {}
