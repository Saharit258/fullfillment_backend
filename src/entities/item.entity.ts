import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { history } from './history.entity';
import { Stores } from './stores.entity';
import { OrderNo } from './orderno.entity';

@Entity()
export class item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sku', nullable: true, type: 'varchar' })
  sku: string;

  @Column({ name: 'name', nullable: true, type: 'varchar' })
  name: string;

  @Column({ name: 'details', nullable: true, type: 'text' })
  details: string;

  @Column({ name: 'quantity', nullable: true, type: 'int4' })
  quantity: number;

  @OneToMany(() => history, (history) => history.item)
  history: history[];

  @ManyToOne(() => Stores, (stores) => stores.item)
  stores: Stores;

  @OneToMany(() => OrderNo, (orderno) => orderno.item)
  orderno: OrderNo[];
}
