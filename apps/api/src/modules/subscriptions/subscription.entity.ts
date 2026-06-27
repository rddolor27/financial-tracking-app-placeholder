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
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  plan_id: string;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: ['active', 'cancelled', 'expired', 'past_due'],
  })
  status: 'active' | 'cancelled' | 'expired' | 'past_due';

  @Column({ type: 'enum', enum: ['web', 'mobile'] })
  platform: 'web' | 'mobile';

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymongo_subscription_id: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  current_period_start: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  current_period_end: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  cancelled_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
