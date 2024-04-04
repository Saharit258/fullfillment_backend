import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Item } from './item.entity';
import { Lot } from './lot.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order', nullable: true, type: 'varchar' })
  order: string;

  @Column({ name: 'out_date', nullable: true, type: 'timestamptz' })
  outDate: Date;

  @Column({ name: 'quantity', nullable: true, type: 'int4' })
  quantity: number;

  @Column({ name: 'remark', nullable: true, type: 'varchar' })
  remark: string;

  @ManyToOne(() => Item, (item) => item.history)
  item: Item;

  @ManyToOne(() => Lot, (lot) => lot.history)
  lot: Lot;
}
