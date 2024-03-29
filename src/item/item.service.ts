import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { item } from '../entities/item.entity';
import { history } from '../entities/history.entity';
import { CreateItemDto, PageOptionsDto } from './dto/create-item.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { error } from 'console';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(item)
    private itemRepository: Repository<item>,
    @InjectRepository(history)
    private historyRepository: Repository<history>,
    private connection: Connection,
  ) {}

  async addItem(body: CreateItemDto) {
    const newItem = this.itemRepository.create({
      sku: body.sku,
      name: body.name,
      details: body.details,
      quantity: 0,
      stores: { id: body.stores },
    });

    return await this.itemRepository.save(newItem);
  }

  async addItemTest(body: CreateItemDto[]) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const itemData of body) {
        await queryRunner.manager.getRepository(item).save({
          sku: itemData.sku,
          name: itemData.name,
          details: itemData.details,
          quantity: 0,
          stores: { id: itemData.stores },
        });
      }

      await queryRunner.commitTransaction();
      return body;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('เกิดข้อผิดพลาดในการเพิ่มไอเท็ม:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
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

  async getItems() {
    const getItems = await this.itemRepository.find({
      relations: { stores: true, history: { lot: true } },
    });
    return getItems;
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

  async getItem(id: number) {
    const getItem = await this.itemRepository.findOne({
      where: { id },
      relations: { stores: true, history: { lot: true } },
    });
    return getItem;
  }

  async remove(id: number) {
    const findByids = await this.getItem(id);

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

  async updateItem(id: number, body: UpdateItemDto) {
    try {
      const foundItem = await this.getItem(id);
      foundItem.sku = body.sku;
      foundItem.name = body.name;
      foundItem.details = body.details;
      const updatedItem = await this.itemRepository.save(foundItem);
      return updatedItem;
    } catch (error) {
      throw new Error(`${error.message} ${id} ไม่พบข้อมูล `);
    }
  }
}
