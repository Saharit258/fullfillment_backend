import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { item } from '../endtiter/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(item)
    private itemRepository: Repository<item>,
  ) {}

  addItem(body: any) {
    const newItem = new item();
    newItem.sku = body.sku;
    newItem.name = body.name;
    newItem.details = body.details;
    newItem.quantity = body.quantity;

    return this.itemRepository.save(newItem);
  }

  getItem() {
    const getItem = this.itemRepository.find();
    return getItem;
  }
}
