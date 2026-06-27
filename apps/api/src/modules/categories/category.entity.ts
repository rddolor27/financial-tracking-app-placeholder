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

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ['expense', 'income'] })
  type: 'expense' | 'income';

  @Column({ type: 'varchar', length: 50 })
  icon: string;

  @Column({ type: 'varchar', length: 7 })
  color: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'boolean', default: false })
  is_hidden: boolean;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
