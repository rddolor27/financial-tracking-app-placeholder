import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Investment } from './investment.entity';

@Entity('investment_transactions')
export class InvestmentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  investment_id: string;

  @ManyToOne(() => Investment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investment_id' })
  investment: Investment;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ['buy', 'sell', 'dividend'] })
  type: 'buy' | 'sell' | 'dividend';

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price_per_unit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  fees: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
