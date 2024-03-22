import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { item } from '../entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(item)
    private itemRepository: Repository<item>,
  ) {}

  addItem(body: CreateItemDto) {
    const newItem = this.itemRepository.create({
      // sku: body.sku,
      // name: body.name,
      // details: body.details,
      quantity: 0,
    });

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

  async remove(id: number) {
    const findByids = await this.getItems(id);
    await this.itemRepository.remove(findByids);
    return findByids;
  }

  async updateItem(id: number, body: CreateItemDto) {
    let findByids = await this.getItems(id);
    findByids = { ...findByids, ...body };
    const saveItem = await this.itemRepository.save(findByids);
    return saveItem;
  }
}
