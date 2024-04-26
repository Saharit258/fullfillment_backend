import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from '../history/dto/create-history.dio';
import { ApiTags } from '@nestjs/swagger';
import { HistoryFilterDto } from './dto/history-filter.dto';

@Controller('/history')
@ApiTags('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //-----------------------------------------------------------Get--------------------------------------------------------------//

  // @Get('/:itemId')
  // async getHistory(@Param('itemId', ParseIntPipe) itemId: number) {
  //   const data = await this.historyService.getHistoryById(itemId);
  //   return { data };
  // }

  @Get('/:itemId')
  async getHistoryByIdFilter(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query() body: HistoryFilterDto,
  ) {
    const data = await this.historyService.getHistoryByIdFilter(itemId, body);
    return { data };
  }
}
