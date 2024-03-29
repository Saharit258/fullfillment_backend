import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from '../history/dto/create-history.dio';
import { ApiTags } from '@nestjs/swagger';

@Controller('/history')
@ApiTags('/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async addHistory(@Body() body: CreateHistoryDto) {
    return await this.historyService.addHistorys(body);
  }

  @Post('multiple')
  async addMultipleHistories(@Body() bodies: CreateHistoryDto[]) {
    return await this.historyService.addHistoryss(bodies);
  }

  @Get()
  async getHistory() {
    const data = await this.historyService.getHistorys();
    return { data };
  }

  // @Get('/:id')
  // getHistorys(@Param('id', ParseIntPipe) id: number) {
  //   return this.historyService.getHistorys(id);
  // }
}
