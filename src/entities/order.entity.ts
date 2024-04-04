import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { OrderNo } from './orderno.entity';
import { Item } from './item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_name', nullable: true, type: 'varchar' })
  customerName: string;

  @Column({ name: 'order_date', nullable: true, type: 'timestamptz' })
  orderDate: Date;

  @Column({ name: 'uom', nullable: true, type: 'varchar' })
  uom: string;

  @Column({ name: 'cod', nullable: true, type: 'int4' })
  cod: number;

  @Column({ name: 'phone_name', nullable: true, type: 'varchar' })
  phoneNumber: string;

  @Column({ name: 'address', nullable: true, type: 'varchar' })
  address: string;

  @Column({ name: 'alley', nullable: true, type: 'varchar' })
  alley: string;

  @Column({ name: 'road', nullable: true, type: 'varchar' })
  road: string;

  @Column({ name: 'zip_code', nullable: true, type: 'varchar' })
  zipCode: string;

  @Column({ name: 'province', nullable: true, type: 'varchar' })
  province: string;

  @Column({ name: 'district', nullable: true, type: 'varchar' })
  district: string;

  @Column({ name: 'parish', nullable: true, type: 'varchar' })
  parish: string;

  @Column({ name: 'country', nullable: true, type: 'varchar' })
  country: string;

  @Column({ name: 'status', nullable: true, type: 'varchar' })
  status: string;

  @OneToMany(() => OrderNo, (orderno) => orderno.order)
  orderno: OrderNo[];

  @Column({ name: 'quantity', default: 0 })
  quantity: number;
}
