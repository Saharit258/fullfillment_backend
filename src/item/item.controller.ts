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
import { CreateItemDto, MultiIds, PageOptionsDto } from './dto/create-item.dto';
import { CreateHistoryDto } from '../history/dto/create-history.dio';
import { ApiTags } from '@nestjs/swagger';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Item } from '../entities/item.entity';
import { Connection } from 'typeorm';
import { UpdateItemDto } from './dto/update-item.dto';
import { query } from 'express';
import { itemFilterDto } from './dto/item-filter.dto';

@Controller('/items')
@ApiTags('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly historyService: HistoryService,
  ) {}

  //--------------------------------------------------------Post------------------------------------------------------------------//

  @Post()
  addItem(@Body() body: CreateItemDto) {
    return this.itemService.addItem(body);
  }

  @Post('/multiple')
  async addItems(@Body() body: CreateItemDto[]) {
    const data = await this.itemService.addItemmultiple(body);
    return data;
  }

  //-------------------------------------------------------Get-------------------------------------------------------------------//

  @Get()
  async queryBilderItem(@Query() body: itemFilterDto) {
    const pagination = await this.itemService.queryBilderItem(body);
    return { data: pagination };
  }

  //แสดง PageOptionsDto

  // @Get('sssss')
  // async getItem(@Query() query: PageOptionsDto): Promise<Pagination<Item>> {
  //   return await this.itemService.getIteaam(query);
  // }

  @Get('/:id')
  async getItems(@Param('id', ParseIntPipe) id: number) {
    const data = await this.itemService.getItem(id);
    return { data };
  }

  //------------------------------------------------------------Put---------------------------------------------------------------//

  @Put('/update-quantity')
  async updatehistory(@Body() body: CreateHistoryDto) {
    const data = await this.historyService.addHistorys(body);
    return { data };
  }

  @Put('/update-quantity-multiple')
  async addHistoryBatch(@Body() histories: CreateHistoryDto[]) {
    const result = await this.historyService.addHistoryss(histories);
    return { result };
  }

  @Put('/:id')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateItemDto,
  ) {
    const data = await this.itemService.updateItem(id, body);
    return { data };
  }

  //---------------------------------------------------------Delete--------------------------------------------------------------//

  @Delete('/remove-multiple')
  async removeItems(@Body() body: MultiIds) {
    try {
      await this.itemService.removeItems(body);
      return { data: {} };
    } catch (error) {
      return { error: error.message };
    }
  }

  // @Delete('/:id')
  // async removeItem(@Param('id', ParseIntPipe) id: number) {
  //   await this.itemService.removeItem(id);
  //   return { data: {} };
  // }
}
