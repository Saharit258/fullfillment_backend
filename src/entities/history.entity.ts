import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { item } from './item.entity';
import { lot } from './lot.entity';

@Entity()
export class history {
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

  @ManyToOne(() => item, (item) => item.history)
  item: item;

  @ManyToOne(() => lot, (lot) => lot.history)
  lot: lot;
}
