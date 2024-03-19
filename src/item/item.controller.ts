import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('/item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  addItem(@Body() body: CreateItemDto) {
    return this.itemService.addItem(body);
  }

  @Get()
  getItem() {
    return this.itemService.getItem();
  }

  @Get('/:id')
  async getItems(@Param('id', ParseIntPipe) id: number) {
    return await this.itemService.getItems(id);
  }

  // @Delete('/:id')
  // async removeItem(@Param('id', ParseIntPipe) id: number) {
  //   return await this.itemService.removeItem(id);
  // }
}
