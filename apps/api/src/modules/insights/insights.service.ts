import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

export interface SpendingByCategory {
  category_id: string;
  total: number;
}

export interface IncomeVsExpense {
  income: number;
  expense: number;
  net: number;
}

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  async spendingByCategory(userId: string, startDate: string, endDate: string): Promise<SpendingByCategory[]> {
    const result = await this.transactionsRepo
      .createQueryBuilder('t')
      .select('t.category_id', 'category_id')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.type = :type', { type: 'expense' })
      .andWhere('t.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('t.category_id')
      .orderBy('total', 'DESC')
      .getRawMany();

    return result.map((r) => ({ category_id: r.category_id, total: parseFloat(r.total) }));
  }

  async incomeVsExpense(userId: string, startDate: string, endDate: string): Promise<IncomeVsExpense> {
    const transactions = await this.transactionsRepo.find({
      where: {
        user_id: userId,
        date: Between(startDate, endDate),
      },
    });

    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

    return { income, expense, net: income - expense };
  }

  async trends(userId: string, startDate: string, endDate: string) {
    const result = await this.transactionsRepo
      .createQueryBuilder('t')
      .select("TO_CHAR(t.date::date, 'YYYY-MM')", 'month')
      .addSelect('t.type', 'type')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy("TO_CHAR(t.date::date, 'YYYY-MM')")
      .addGroupBy('t.type')
      .orderBy('month', 'ASC')
      .getRawMany();

    return result.map((r) => ({
      month: r.month,
      type: r.type,
      total: parseFloat(r.total),
    }));
  }

  async savingsRate(userId: string, startDate: string, endDate: string) {
    const { income, expense } = await this.incomeVsExpense(userId, startDate, endDate);
    const rate = income > 0 ? ((income - expense) / income) * 100 : 0;
    return { income, expense, savings: income - expense, rate: Math.round(rate * 100) / 100 };
  }
}
