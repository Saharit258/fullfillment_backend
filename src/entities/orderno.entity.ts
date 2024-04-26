import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Item } from './item.entity';
import { Order } from './order.entity';

@Entity()
export class OrderNo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quantity', nullable: true, type: 'int4' })
  quantity: number;

  @Column({ name: 'orderno_date', nullable: true, type: 'timestamptz' })
  ordernoDate: Date;

  @ManyToOne(() => Item, (item) => item.orderno)
  item: Item;

  @ManyToOne(() => Order, (order) => order.orderno)
  order: Order;
}
