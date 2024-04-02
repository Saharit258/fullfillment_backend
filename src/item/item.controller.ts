import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { HistoryService } from '../history/history.service';
import { CreateItemDto, PageOptionsDto } from './dto/create-item.dto';
import { CreateHistoryDto } from '../history/dto/create-history.dio';
import { ApiTags } from '@nestjs/swagger';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { item } from '../entities/item.entity';
import { Connection } from 'typeorm';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('/items')
@ApiTags('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly historyService: HistoryService,
  ) {}

  @Post()
  addItem(@Body() body: CreateItemDto) {
    return this.itemService.addItem(body);
  }

  @Post('/multiple')
  async addItems(@Body() body: CreateItemDto[]) {
    const data = await this.itemService.addItemmultiple(body);
    return { data };
  }

  @Get()
  async getItemss() {
    const data = await this.itemService.getItems();
    return { data };
  }

  //แสดง PageOptionsDto

  // @Get()
  // async getItem(@Query() query: PageOptionsDto): Promise<Pagination<item>> {
  //   return await this.itemService.getItem(query);
  // }

  @Get('/:id')
  async getItems(@Param('id', ParseIntPipe) id: number) {
    const data = await this.itemService.getItem(id);
    return { data };
  }

  // @Put('/update-quantity')
  // async updateQuantity(@Body() body: CreateHistoryDto) {
  //   return await this.itemService.updateQuantity(body);
  // }

  @Put('/update-quantity')
  async updatehistory(@Body() body: CreateHistoryDto) {
    const data = await this.historyService.addHistorys(body);
    return { data };
  }

  @Put('/:id')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateItemDto,
  ) {
    const data = await this.itemService.updateItem(id, body);
    return { data };
  }

  @Delete('/:id')
  async removeItem(@Param('id', ParseIntPipe) id: number) {
    await this.itemService.removeItem(id);
    return { data: {} };
  }
}
