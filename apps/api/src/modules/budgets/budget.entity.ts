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

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['weekly', 'monthly', 'yearly'] })
  period: 'weekly' | 'monthly' | 'yearly';

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.8 })
  alert_threshold: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
