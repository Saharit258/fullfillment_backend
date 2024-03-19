import { Body, Controller, Get, Post } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller()
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Post('/history')
    addHistory(@Body() body:any) {
      return this.historyService.addHistory(body)
    }

    @Get('/history-list')
    getItem() {
      return this.historyService.getHistory();
    }
}
