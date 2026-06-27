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
import { Category } from '../categories/category.entity';

@Entity('transactions')
export class Transaction {
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

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'enum', enum: ['income', 'expense', 'transfer'] })
  type: 'income' | 'expense' | 'transfer';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'uuid', nullable: true })
  transfer_to_account_id: string | null;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'transfer_to_account_id' })
  transfer_to_account: Account | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location_name: string | null;

  @Column({ type: 'boolean', default: false })
  is_recurring: boolean;

  @Column({
    type: 'enum',
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    nullable: true,
  })
  recurring_interval: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;

  @Column({ type: 'date', nullable: true })
  recurring_next_date: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
