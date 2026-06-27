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
import { Category } from '../categories/category.entity';
import { Account } from '../accounts/account.entity';

@Entity('bill_reminders')
export class BillReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'PHP' })
  currency: string;

  @Column({ type: 'integer' })
  due_day: number;

  @Column({ type: 'enum', enum: ['monthly', 'quarterly', 'yearly'] })
  frequency: 'monthly' | 'quarterly' | 'yearly';

  @Column({ type: 'uuid', nullable: true })
  category_id: string | null;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ type: 'uuid', nullable: true })
  account_id: string | null;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account | null;

  @Column({ type: 'integer', default: 3 })
  reminder_days_before: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'date', nullable: true })
  last_paid_date: string | null;

  @Column({ type: 'boolean', default: false })
  auto_create_transaction: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
