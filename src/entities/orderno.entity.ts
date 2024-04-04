import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { item } from './item.entity';
import { Order } from './order.entity';

@Entity()
export class OrderNo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quantity', nullable: true, type: 'int4' })
  quantity: number;

  @ManyToOne(() => item, (item) => item.orderno)
  item: item;

  @ManyToOne(() => Order, (order) => order.orderno)
  order: Order;
}
