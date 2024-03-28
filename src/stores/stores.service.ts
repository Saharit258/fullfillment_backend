import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Stores } from '../entities/stores.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { item } from '../entities/item.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Stores)
    private storeRepository: Repository<Stores>,
    @InjectRepository(item)
    private itemRepository: Repository<item>,
  ) {}

  async addStores(body: CreateStoreDto) {
    const addStores = this.storeRepository.create({
      name: body.name,
      shipperCode: body.shipperCode,
      shipperName: body.shipperName,
      zipCode: body.zipCode,
      phoneNumber: body.phoneNumber,
      email: body.email,
      isDelete: false,
    });

    const data = await this.storeRepository.save(addStores);
    return { data };
  }

  async getStore() {
    const data = await this.storeRepository.find({
      where: { isDelete: false },
    });
    return { data };
  }

  // async removeStore(id: number) {
  //   const removeStore = await this.storeRepository.findOne({
  //     where: { id },
  //   });

  //   const items = await this.itemRepository.find({
  //     where: { stores: removeStore },
  //   });

  //   for (const item of items) {
  //     item.stores = null;
  //     await this.itemRepository.save(item);
  //   }

  //   await this.storeRepository.remove(removeStore);
  //   return true;
  // }

  async removeStore(id: number) {
    const storeToRemove = await this.storeRepository.findOne({
      where: { id },
    });

    if (storeToRemove) {
      storeToRemove.isDelete = true;

      await this.storeRepository.save(storeToRemove);
      return true;
    } else {
      return false;
    }
  }

  async updateStore(id: number, body: CreateStoreDto) {
    let updateStore = await this.storeRepository.findOne({
      where: { id },
    });
    updateStore = { ...updateStore, ...body };
    const savedStore = await this.storeRepository.save(updateStore);
    return savedStore;
  }

  // async updateStores(id: number, body: CreateStoreDto) {
  //   const Stores = await this.storeRepository.findOne({
  //     where: { id },
  //   });
  //   Stores = { ...Stores, ...body };
  //   const saveStoress = this.storeRepository.save(Stores)
  // }

  // async updateItem(id: number, body: CreateItemDto) {
  //   let updateItem = await this.getItem(id);
  //   updateItem = { ...updateItem, ...body };
  //   const sevaItem = this.ItemRepository.save(updateItem);
  //   return sevaItem;
  // }

  // async updateStore(id: number, body: CreateStoreDto) {
  //   const foundStore = await this.storeRepository.findOne({
  //   where: { id },
  // });
  //   foundStore.sku = body.sku;
  //   foundStore.name = body.name;
  //   foundStore.details = body.details;

  //   const updatedItem = await this.itemRepository.save(foundItem);
  //   return updatedItem;
  // }
}
