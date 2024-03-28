import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { item } from '../entities/item.entity';
import { history } from '../entities/history.entity';
import { CreateItemDto, PageOptionsDto } from './dto/create-item.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(item)
    private itemRepository: Repository<item>,
    @InjectRepository(history)
    private historyRepository: Repository<history>,
  ) {}

  addItem(body: CreateItemDto) {
    const newItem = this.itemRepository.create({
      sku: body.sku,
      name: body.name,
      details: body.details,
      quantity: 0,
      stores: { id: body.stores },
    });

    return this.itemRepository.save(newItem);
  }

  async addItems(body: CreateItemDto[]) {
    const newItem = body.map((body) => {
      return this.itemRepository.create({
        sku: body.sku,
        name: body.name,
        details: body.details,
        quantity: 0,
        stores: { id: body.stores },
      });
    });

    const saveItem = await this.itemRepository.save(newItem);

    return saveItem;
  }

  async getItemss() {
    const getItem = await this.itemRepository.find({
      relations: { stores: true, history: { lot: true } },
    });
    return getItem;
  }

  //แสดงPageOptionsDto

  // async getItem(query: PageOptionsDto): Promise<Pagination<item>> {
  //   const options: IPaginationOptions = {
  //     page: query.page,
  //     limit: query.limit,
  //   };

  //   const paginatedItems = await paginate(this.itemRepository, options, {
  //     relations: ['stores', 'history'],
  //   });

  //   return paginatedItems;
  // }

  async getItems(id: number) {
    const getItems1 = await this.itemRepository.findOne({
      where: { id },
      relations: { stores: true, history: { lot: true } },
    });
    return getItems1;
  }

  async remove(id: number) {
    const findByids = await this.getItems(id);

    const history = await this.historyRepository.find({
      where: { item: findByids },
    });
    for (const historys of history) {
      historys.item = null;
      await this.historyRepository.save(historys);
    }

    await this.itemRepository.remove(findByids);
    return true;
  }

  async updateItem(id: number, body: CreateItemDto) {
    const foundItem = await this.getItems(id);
    foundItem.sku = body.sku;
    foundItem.name = body.name;
    foundItem.details = body.details;
    const updatedItem = await this.itemRepository.save(foundItem);
    return updatedItem;
  }
}
