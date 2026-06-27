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

@Entity('goals')
export class Goal {
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
  target_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  current_amount: number;

  @Column({ type: 'varchar', length: 3, default: 'PHP' })
  currency: string;

  @Column({ type: 'date', nullable: true })
  target_date: string | null;

  @Column({ type: 'varchar', length: 50, default: 'fa-bullseye' })
  icon: string;

  @Column({ type: 'varchar', length: 7, default: '#4CAF50' })
  color: string;

  @Column({ type: 'boolean', default: false })
  is_completed: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
