import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('stores')
@ApiTags('/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async addStores(@Body() body: CreateStoreDto) {
    return await this.storesService.addStores(body);
  }

  @Get()
  async getStore() {
    return await this.storesService.getStore();
  }

  @Delete('/:id')
  async removeStore(@Param('id', ParseIntPipe) id: number) {
    return await this.storesService.removeStore(id);
  }

  @Put('/:id')
  async updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateStoreDto,
  ) {
    return await this.storesService.updateStore(id, body);
  }
}
