import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { history } from './history.entity';

@Entity()
export class lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: true, type: 'varchar' })
  name: string;

  @Column({ name: 'incoming_date', nullable: true, type: 'timestamptz' })
  incomingDate: Date;

  @Column({ name: 'quantity', nullable: true, type: 'int4' })
  quantity: number;

  @OneToMany(() => history, (history) => history.id)
  history: history[];
}
