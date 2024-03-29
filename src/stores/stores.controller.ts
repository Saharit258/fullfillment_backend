import { error } from 'console';
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
    try {
      const data = await this.storesService.addStores(body);
      return { data };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  @Get()
  async getStore() {
    try {
      const data = await this.storesService.getStore();
      return { data };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  @Put('/:id')
  async updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateStoreDto,
  ) {
    try {
      const data = await this.storesService.updateStore(id, body);
      return { data };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  @Delete('/:id')
  async removeStore(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.storesService.removeStore(id);
      return { data: {} };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
