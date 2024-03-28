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
import { LotService } from './lot.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { CreateItemDto } from '../item/dto/create-item.dto';
import { CreateHistoryDto } from '../history/dto/create-history.dio';
import { ApiTags } from '@nestjs/swagger';

@Controller('/lots')
@ApiTags('/lots')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Post()
  addLot(@Body() body: CreateLotDto) {
    return this.lotService.addLot(body);
  }
}
