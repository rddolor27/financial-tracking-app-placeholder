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

@Entity('statements')
export class Statement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  account_id: string | null;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account | null;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'varchar', length: 500 })
  file_url: string;

  @Column({ type: 'integer' })
  file_size: number;

  @Column({
    type: 'enum',
    enum: ['bank', 'credit_card', 'investment', 'other'],
  })
  statement_type: 'bank' | 'credit_card' | 'investment' | 'other';

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  parse_status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({
    type: 'enum',
    enum: ['rule_based', 'llm', 'client_side'],
    nullable: true,
  })
  parse_method: 'rule_based' | 'llm' | 'client_side' | null;

  @Column({ type: 'jsonb', nullable: true })
  parsed_data: unknown;

  @Column({ type: 'integer', default: 0 })
  transactions_created: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
