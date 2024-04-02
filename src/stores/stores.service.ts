import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Stores } from '../entities/stores.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Stores)
    private storeRepository: Repository<Stores>,
  ) {}

  //-----------------------------------------------------เพิ่มข้อมูลร้านค้า-------------------------------------------------------------//

  async addStores(body: CreateStoreDto) {
    try {
      const addStores = this.storeRepository.create({
        name: body.name,
        shipperCode: body.shipperCode,
        shipperName: body.shipperName,
        zipCode: body.zipCode,
        phoneNumber: body.phoneNumber,
        email: body.email,
        isDelete: false,
      });

      const store = await this.storeRepository.save(addStores);
      return store;
    } catch (error) {
      throw new Error(` ไม่สามารถเพิ่มได้ ${error.message}`);
    }
  }

  //----------------------------------------------------แสดงร้านค้าทุกร้าน-----------------------------------------------------------//

  async getStore() {
    try {
      const data = await this.storeRepository.find({
        order: { id: 'DESC' },
        where: { isDelete: false },
      });
      return data;
    } catch (error) {
      throw new Error(` ไม่สามารถแสดงผลได้ `);
    }
  }

  //---------------------------------------------------ลบร้านค้า---------------------------------------------------------------------//

  async removeStore(id: number) {
    try {
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
    } catch (error) {
      throw new Error(` ไม่สามารถลบได้ !!`);
    }
  }

  //-----------------------------------------------------แก้ไขข้อมูลร้านค้า-----------------------------------------------------------//

  async updateStore(id: number, body: CreateStoreDto) {
    try {
      const updateResult = await this.storeRepository.update({ id }, body);
      if (updateResult.affected === 0) {
        throw new Error(`${id}`);
      }
      const updatedStore = await this.storeRepository.findOne({
        where: { id },
      });
      return updatedStore;
    } catch (error) {
      throw new Error(`ไม่สามารถแก้ไขได้ ${id}: ${error.message}`);
    }
  }
}
