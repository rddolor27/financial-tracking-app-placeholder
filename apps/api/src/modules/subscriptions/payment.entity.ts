import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Subscription } from './subscription.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  subscription_id: string | null;

  @ManyToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription | null;

  @Column({ type: 'varchar', length: 255 })
  paymongo_payment_id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'PHP' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded'],
  })
  status: 'pending' | 'paid' | 'failed' | 'refunded';

  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  @Column({ type: 'enum', enum: ['one_time', 'monthly'] })
  billing_type: 'one_time' | 'monthly';

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'timestamptz', nullable: true })
  paid_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
