import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './investment.entity';
import { InvestmentTransaction } from './investment-transaction.entity';
import type { CreateInvestmentDto, UpdateInvestmentDto, CreateInvestmentTransactionDto } from './dtos';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentsRepo: Repository<Investment>,
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTxRepo: Repository<InvestmentTransaction>,
  ) {}

  async findAllByUser(userId: string): Promise<Investment[]> {
    return this.investmentsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<Investment> {
    const investment = await this.investmentsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!investment) {
      throw new NotFoundException('Investment not found');
    }
    return investment;
  }

  async create(userId: string, data: CreateInvestmentDto): Promise<Investment> {
    const investment = this.investmentsRepo.create({ ...data, user_id: userId });
    return this.investmentsRepo.save(investment);
  }

  async update(id: string, userId: string, data: UpdateInvestmentDto | Partial<Investment>): Promise<Investment> {
    const investment = await this.findOneByUser(id, userId);
    this.investmentsRepo.merge(investment, data as Partial<Investment>);
    return this.investmentsRepo.save(investment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.findOneByUser(id, userId);
    await this.investmentsRepo.remove(investment);
  }

  // Investment Transactions
  async findTransactions(investmentId: string, userId: string): Promise<InvestmentTransaction[]> {
    await this.findOneByUser(investmentId, userId);
    return this.investmentTxRepo.find({
      where: { investment_id: investmentId, user_id: userId },
      order: { date: 'DESC' },
    });
  }

  async createTransaction(
    userId: string,
    data: CreateInvestmentTransactionDto & { investment_id: string },
  ): Promise<InvestmentTransaction> {
    await this.findOneByUser(data.investment_id!, userId);
    const tx = this.investmentTxRepo.create({ ...data, user_id: userId });
    const saved = await this.investmentTxRepo.save(tx);

    // Update investment's avg_buy_price and quantity
    if (data.type === 'buy') {
      const investment = await this.findOneByUser(data.investment_id!, userId);
      const totalCost =
        Number(investment.quantity) * Number(investment.avg_buy_price) +
        Number(data.quantity) * Number(data.price_per_unit);
      const totalQty = Number(investment.quantity) + Number(data.quantity);
      await this.update(investment.id, userId, {
        quantity: totalQty,
        avg_buy_price: totalQty > 0 ? totalCost / totalQty : 0,
      });
    } else if (data.type === 'sell') {
      const investment = await this.findOneByUser(data.investment_id!, userId);
      await this.update(investment.id, userId, {
        quantity: Number(investment.quantity) - Number(data.quantity),
      });
    }

    return saved;
  }
}
