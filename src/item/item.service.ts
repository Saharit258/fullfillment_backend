import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { History } from '../entities/history.entity';
import { CreateItemDto, MultiIds, PageOptionsDto } from './dto/create-item.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { error } from 'console';
import { UpdateItemDto } from './dto/update-item.dto';
import { Stores } from '../entities/stores.entity';
import { CreateHistoryDto } from '../history/dto/create-history.dio';
import { itemFilterDto } from './dto/item-filter.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(Stores)
    private storesRepository: Repository<Stores>,
    private connection: Connection,
  ) {}

  //-------------------------------------------เพิ่มสินค้า------------------------------------------------------------------------//

  async addItem(body: CreateItemDto): Promise<Item> {
    try {
      const existingItem = await this.itemRepository.findOne({
        where: { sku: body.sku },
      });
      if (existingItem) {
        throw new Error(`SKU ${body.sku} มีอยู่แล้วในระบบ`);
      }

      const newItem = this.itemRepository.create({
        sku: body.sku,
        name: body.name,
        details: body.details,
        quantity: 0,
        isDelete: false,
        stores: { id: body.stores },
      });

      return await this.itemRepository.save(newItem);
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  //-------------------------------------------------เพิ่มสินค้าหลายจำนวน----------------------------------------------------------//

  async addItemmultiple(body: CreateItemDto[]): Promise<CreateItemDto[]> {
    let queryRunner: QueryRunner;
    try {
      queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const itemData of body) {
        await queryRunner.manager.getRepository(Item).save({
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

  //-----------------------------------------------------แสดงข้อมูลสินค้าทั้งหมด-------------------------------------------------------//

  getItems(): Promise<Item[]> {
    const getItems = this.itemRepository.find({
      where: { isDelete: false },
      order: { id: 'DESC' },
      relations: { stores: true, history: { lot: true } },
    });
    return getItems;
  }

  //----------------------------------------------------------แสดงข้อมูลสินค้า1ชิ้น----------------------------------------------------//

  async getItem(id: number): Promise<Item> {
    const getItem = await this.itemRepository.findOne({
      where: { id },
      relations: { stores: true, history: { lot: true } },
    });
    return getItem;
  }

  //-----------------------------------------------------------ลบสินค้า-----------------------------------------------------------//

  async removeItem(id: number): Promise<boolean> {
    const itemToRemove = await this.getItem(id);
    if (!itemToRemove) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    await this.itemRepository.update(id, { isDelete: true });
    return true;
  }

  async summaryQuantity(id: number) {
    const sum = await this.historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.quantity)::int4', 'sum')
      .where('history.itemId = :id', { id })
      .getRawOne();
    return sum;
  }

  //---------------------------------------------------------แก้ไขสินค้า------------------------------------------------------------//

  async updateItem(id: number, body: UpdateItemDto): Promise<Item> {
    try {
      const foundItem = await this.getItem(id);
      foundItem.sku = body.sku;
      foundItem.name = body.name;
      foundItem.details = body.details;
      foundItem.stores.id = body.stores;
      const updatedItem = await this.itemRepository.save(foundItem);
      return updatedItem;
    } catch (error) {
      throw new Error(`${error.message} ${id} ไม่พบข้อมูล`);
    }
  }

  //-----------------------------------------------------removeItems---------------------------------------------------------------//

  async removeItems(body: MultiIds): Promise<number[]> {
    try {
      const deletedItems = await Promise.all(
        body.ids.map(async (id) => {
          const itemToRemove = await this.getItem(id);
          if (!itemToRemove) {
            throw new NotFoundException(`Item with ID ${id} not found`);
          }
          await this.itemRepository.update(id, { isDelete: true });
          return id;
        }),
      );

      return deletedItems;
    } catch (error) {
      throw new Error(`เกิดข้อผิดพลาดในการลบไอเท็ม: ${error.message}`);
    }
  }

  //---------------------------------------------------ค้นหา---------------------------------------------------------------------//

  async queryBilderItem(body: itemFilterDto): Promise<Pagination<Item>> {
    const { sku, name, details, stores, everything } = body;

    const options = {
      page: body.page,
      limit: body.limit,
    };

    let queryBuilder = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.stores', 'stores')
      .where('item.isDelete != :excludedStores', { excludedStores: true })
      .orderBy('item.id', 'DESC');

    if (sku) {
      queryBuilder = queryBuilder.andWhere('item.sku like :sku', {
        sku: `%${sku}%`,
      });
    }

    if (name) {
      queryBuilder = queryBuilder.andWhere('item.name like :name', {
        name: `%${name}%`,
      });
    }

    if (details) {
      queryBuilder = queryBuilder.andWhere('item.details like :details', {
        details: `%${details}%`,
      });
    }

    if (stores) {
      queryBuilder = queryBuilder.andWhere('stores.name like :stores', {
        stores: `%${stores}%`,
      });
    }

    if (everything) {
      queryBuilder = queryBuilder.andWhere(
        'item.sku like :everything or item.name like :everything or item.details like :everything or stores.name like :everything or (item.quantity)::text like :everything',
        {
          everything: `%${everything}%`,
        },
      );
    }

    const data = await paginate(queryBuilder, options);
    return data;
  }
}
