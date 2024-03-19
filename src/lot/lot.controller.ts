import { Body, Controller, Get, Post } from '@nestjs/common';
import { LotService } from './lot.service';

@Controller()
export class LotController {
    constructor(private readonly lotService: LotService) {}

    @Post('/lot')
    addLot(@Body() body:any) {
      return this.lotService.addLot(body)
    }

    @Get('/lot-list')
    getLot() {
      return this.lotService.getLot();
    }
}
