import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller()
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post('/item')
    addItem(@Body() body:any) {
      return this.itemService.addItem(body)
    }
    
    @Get('/item-list')
    getItem() {
      return this.itemService.getItem();
    }
}
