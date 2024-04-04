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
      const newItem = this.itemRepository.create({
        sku: body.sku,
        name: body.name,
        details: body.details,
        quantity: 0,
        stores: { id: body.stores },
      });
      return await this.itemRepository.save(newItem);
    } catch (error) {
      throw new Error(`${error.message}`);
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
      order: { id: 'DESC' },
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
          await this.removeItem(id);
          return id;
        }),
      );

      return deletedItems;
    } catch (error) {
      throw new Error(`เกิดข้อผิดพลาดในการลบไอเท็ม: ${error.message}`);
    }
  }
}
