import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('/history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Post()
    addHistory(@Body() body:any) {
      return this.historyService.addHistory(body)
    }

    @Get()
    async getHistory() {
      return await this.historyService.getHistory();
    }

    @Get('/:id')
    getHistorys(@Param('id', ParseIntPipe) id: number) {
      return this.historyService.getHistorys(id);
    }

    @Put()
    editHistory() {}
}
