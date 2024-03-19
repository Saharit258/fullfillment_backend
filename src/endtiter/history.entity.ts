import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { item } from './item.entity';
import { lot } from './lot.entity';

@Entity()
export class history {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order', nullable: true, type: 'varchar' })
  order: string;

  @Column({ name: 'note', nullable: true, type: 'varchar' })
  note: string;

  @Column({ name: 'out_date', nullable: true, type: 'timestamptz' })
  outDate: Date;

  @Column({ name: 'quantity', nullable: true, type: 'int4' })
  quantity: number;

  @ManyToOne(() => item, (item) => item.history)
  item: item;

  @ManyToOne(() => lot, (lot) => lot.history)
  lot: lot;
}
