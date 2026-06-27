import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('exchange_rates')
@Unique(['base_currency', 'target_currency'])
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 3 })
  base_currency: string;

  @Column({ type: 'varchar', length: 3 })
  target_currency: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  rate: number;

  @Column({ type: 'timestamptz' })
  fetched_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
