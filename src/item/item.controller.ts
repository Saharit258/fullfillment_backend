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

@Controller('/items')
@ApiTags('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  addItem(@Body() body: CreateItemDto) {
    return this.itemService.addItem(body);
  }

  @Get()
  async getItemss() {
    const data = await this.itemService.getItemss();
    return { data };
  }

  // @Get()
  // async getItem(@Query() query: PageOptionsDto): Promise<Pagination<item>> {
  //   return await this.itemService.getItem(query);
  // }

  @Get('/:id')
  async getItems(@Param('id', ParseIntPipe) id: number) {
    const data = await this.itemService.getItems(id);
    return { data };
  }

  @Put('/:id')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateItemDto,
  ) {
    return await this.itemService.updateItem(id, body);
  }

  @Delete('/:id')
  async removeItem(@Param('id', ParseIntPipe) id: number) {
    return await this.itemService.remove(id);
  }
}
