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
@ApiTags('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //-----------------------------------------------------------Get--------------------------------------------------------------//

  @Get('/:itemId')
  async getHistory(@Param('itemId', ParseIntPipe) itemId: number) {
    const data = await this.historyService.getHistoryById(itemId);
    return { data };
  }
}
