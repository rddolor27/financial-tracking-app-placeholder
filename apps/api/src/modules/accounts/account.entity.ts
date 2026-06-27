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

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bank_name: string | null;

  @Column({
    type: 'enum',
    enum: [
      'checking',
      'savings',
      'credit_card',
      'cash',
      'investment',
      'loan',
      'e_wallet',
    ],
  })
  type:
    | 'checking'
    | 'savings'
    | 'credit_card'
    | 'cash'
    | 'investment'
    | 'loan'
    | 'e_wallet';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 3, default: 'PHP' })
  currency: string;

  @Column({ type: 'varchar', length: 7, default: '#4A90D9' })
  color: string;

  @Column({ type: 'varchar', length: 50, default: 'fa-wallet' })
  icon: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
