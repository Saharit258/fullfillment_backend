import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { item } from '../endtiter/item.entity';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(item)
    private itemRepository: Repository<item>,
  ) {}

  addItem(body: CreateItemDto) {
    const newItem = new item();
    newItem.sku = body.sku;
    newItem.name = body.name;
    newItem.details = body.details;
    newItem.quantity = body.quantity;

    return this.itemRepository.save(newItem);
  }

  async getItem() {
    const getItem = await this.itemRepository.find();
    return getItem;
  }

  async getItems(id: number) {
    const getItems1 = await this.itemRepository.findOne({
      where: { id },
    });
    return getItems1;
  }

  // async removeItem(id: number) {
  //   const findByid = await this.getItems(id);
  //   await this.itemRepository.remove(findByid);
  //   return findByid;
  // }
}
