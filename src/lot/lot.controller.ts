import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LotService } from './lot.service';
import { CreateLotDto } from './dto/create-lot.dto';

@Controller('/lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Post()
  addLot(@Body() body: CreateLotDto) {
    return this.lotService.addLot(body);
  }

  @Get()
  async getLot() {
    const data = await this.lotService.getLot();
    return { data };
  }

  @Get('/:id')
  async getLots(@Param('id', ParseIntPipe) id: number) {
    return await this.lotService.getLots(id);
  }
}
