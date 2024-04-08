import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class HistoryOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'out_date', nullable: true, type: 'timestamptz' })
  orderStatusDate: Date;

  @Column({ name: 'note', nullable: true, type: 'varchar' })
  note: string;

  @Column({ name: 'status', nullable: true, type: 'varchar' })
  status: string;

  @ManyToOne(() => Order, (order) => order.historyOrder)
  order: Order;
}
