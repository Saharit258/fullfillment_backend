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
import { CreateItemDto, PageOptionsDto } from './dto/create-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { item } from '../entities/item.entity';
import { Connection } from 'typeorm';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('/items')
@ApiTags('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  addItem(@Body() body: CreateItemDto) {
    return this.itemService.addItem(body);
  }

  @Post('/multiple')
  async addItems(@Body() body: CreateItemDto[]) {
    const data = await this.itemService.addItems(body);
    return { data };
  }

  @Post('/test')
  async addItemTest(@Body() body: CreateItemDto[]) {
    try {
      const result = await this.itemService.addItemTest(body);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to add items', error };
    }
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

  @Put('/:id')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateItemDto,
  ) {
    return await this.itemService.updateItem(id, body);
  }

  @Delete('/:id')
  async removeItem(@Param('id', ParseIntPipe) id: number) {
    return await this.itemService.remove(id);
  }
}
