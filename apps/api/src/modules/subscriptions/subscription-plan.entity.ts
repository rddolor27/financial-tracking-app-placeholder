import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;

  @Column({ type: 'enum', enum: ['web', 'mobile', 'both'] })
  platform: 'web' | 'mobile' | 'both';

  @Column({ type: 'enum', enum: ['free', 'one_time', 'monthly'] })
  billing_type: 'free' | 'one_time' | 'monthly';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'jsonb' })
  features: Record<string, boolean>;

  @Column({ type: 'integer', nullable: true })
  max_accounts: number | null;

  @Column({ type: 'integer', nullable: true })
  max_transactions_per_month: number | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'integer', default: 0 })
  sort_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
