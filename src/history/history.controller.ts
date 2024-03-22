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

@Controller('/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async addHistory(@Body() body: CreateHistoryDto) {
    return await this.historyService.addHistory(body);
  }

  @Get()
  async getHistory() {
    const data = await this.historyService.getHistory();
    return { data };
  }

  @Get('/:id')
  getHistorys(@Param('id', ParseIntPipe) id: number) {
    return this.historyService.getHistorys(id);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.historyService.remove(id);
  }
}
