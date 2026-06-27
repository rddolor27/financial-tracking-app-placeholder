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
import { Account } from '../accounts/account.entity';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  account_id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'varchar', length: 20 })
  symbol: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: ['crypto', 'us_stock', 'ph_stock'] })
  asset_type: 'crypto' | 'us_stock' | 'ph_stock';

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  avg_buy_price: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  current_price: number;

  @Column({ type: 'timestamptz', nullable: true })
  price_updated_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
