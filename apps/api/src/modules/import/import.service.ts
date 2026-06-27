import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Account } from '../accounts/account.entity';

export interface CsvRow {
  date: string;
  description: string;
  amount: string;
  type: string;
  category_id?: string;
}

export interface ImportPreview {
  rows: CsvRow[];
  total: number;
  duplicates: number;
}

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
    @InjectRepository(Account) private readonly accountsRepo: Repository<Account>,
  ) {}

  async parseCsv(csvContent: string): Promise<CsvRow[]> {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new BadRequestException('CSV must have a header row and at least one data row');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const rows: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });

      rows.push({
        date: row.date || '',
        description: row.description || row.memo || '',
        amount: row.amount || row.value || '0',
        type: row.type || (parseFloat(row.amount || '0') >= 0 ? 'income' : 'expense'),
        category_id: row.category_id,
      });
    }

    return rows;
  }

  async preview(userId: string, accountId: string, csvContent: string): Promise<ImportPreview> {
    const rows = await this.parseCsv(csvContent);

    let duplicates = 0;
    for (const row of rows) {
      const existing = await this.transactionsRepo.findOne({
        where: {
          user_id: userId,
          account_id: accountId,
          date: row.date,
          amount: Math.abs(parseFloat(row.amount)),
          description: row.description,
        },
      });
      if (existing) duplicates++;
    }

    return { rows, total: rows.length, duplicates };
  }

  async confirm(
    userId: string,
    accountId: string,
    rows: CsvRow[],
    defaultCategoryId: string,
  ): Promise<{ imported: number }> {
    const account = await this.accountsRepo.findOne({
      where: { id: accountId, user_id: userId },
    });
    if (!account) throw new BadRequestException('Account not found');

    let imported = 0;
    for (const row of rows) {
      const amount = Math.abs(parseFloat(row.amount));
      if (isNaN(amount) || amount === 0) continue;

      const type = row.type === 'income' ? 'income' : 'expense';

      const transaction = this.transactionsRepo.create({
        user_id: userId,
        account_id: accountId,
        category_id: row.category_id || defaultCategoryId,
        type,
        amount,
        description: row.description || null,
        date: row.date,
      });

      await this.transactionsRepo.save(transaction);
      imported++;
    }

    return { imported };
  }
}
