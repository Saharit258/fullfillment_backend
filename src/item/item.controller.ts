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
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('/items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  addItem(@Body() body: CreateItemDto) {
    return this.itemService.addItem(body);
  }

  @Get()
  async getItem() {
    const data = await this.itemService.getItem();
    return { data };
  }

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
