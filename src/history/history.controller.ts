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

@Controller('/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async getHistory() {
    const data = await this.historyService.getHistory();
    return { data };
  }

  @Get('/:id')
  getHistorys(@Param('id', ParseIntPipe) id: number) {
    return this.historyService.getHistorys(id);
  }

  @Put('/:id')
  async updateHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return await this.historyService.updateHistory(id, body);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.historyService.remove(id);
  }
}
