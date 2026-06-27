import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

export interface ExportData {
  transactions: Array<{
    date: string;
    description: string | null;
    type: string;
    amount: number;
    category_id: string;
  }>;
}

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  async getExportData(userId: string, startDate: string, endDate: string): Promise<ExportData> {
    const transactions = await this.transactionsRepo.find({
      where: {
        user_id: userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });

    return {
      transactions: transactions.map((t) => ({
        date: t.date,
        description: t.description,
        type: t.type,
        amount: Number(t.amount),
        category_id: t.category_id,
      })),
    };
  }

  async exportCsv(userId: string, startDate: string, endDate: string): Promise<string> {
    const data = await this.getExportData(userId, startDate, endDate);

    const headers = 'Date,Description,Type,Amount';
    const rows = data.transactions.map(
      (t) => `${t.date},"${(t.description || '').replace(/"/g, '""')}",${t.type},${t.amount}`,
    );

    return [headers, ...rows].join('\n');
  }
}
