import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { History } from './history.entity';

@Entity()
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: true, type: 'varchar' })
  name: string;

  @Column({ name: 'incoming_date', nullable: true, type: 'timestamptz' })
  incomingDate: Date;

  @Column({ name: 'quantity', nullable: true, type: 'int4' })
  quantity: number;

  @OneToMany(() => History, (history) => history.id)
  history: History[];
}
