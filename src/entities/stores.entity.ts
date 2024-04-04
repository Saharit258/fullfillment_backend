import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Stores {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: true, type: 'varchar' })
  name: string;

  @Column({ name: 'shipper_code', nullable: true, type: 'varchar' })
  shipperCode: string;

  @Column({ name: 'shipper_name', nullable: true, type: 'varchar' })
  shipperName: string;

  @Column({ name: 'zip_code', nullable: true, type: 'varchar' })
  zipCode: string;

  @Column({ name: 'phone_number', nullable: true, type: 'varchar' })
  phoneNumber: string;

  @Column({ name: 'email', nullable: true, type: 'varchar' })
  email: string;

  @Column({
    name: 'is_delete',
    nullable: true,
    type: 'boolean',
    default: false,
  })
  isDelete: boolean;

  @OneToMany(() => Item, (item) => item.stores)
  item: Item[];
}
