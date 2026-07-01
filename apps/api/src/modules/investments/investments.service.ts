import { Inject, Injectable, NotFoundException, type Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './investment.entity';
import { InvestmentTransaction } from './investment-transaction.entity';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { CreateInvestmentTransactionDto } from './dtos/create-investment-transaction.dto';
import { InvestmentModel } from './models/investment.model';
import { InvestmentTransactionModel } from './models/investment-transaction.model';
import { INVESTMENTS_SERVICE } from './investments.constants';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentsRepo: Repository<Investment>,
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTxRepo: Repository<InvestmentTransaction>,
  ) {}

  private async findEntityByUser(id: string, userId: string): Promise<Investment> {
    const investment = await this.investmentsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!investment) {
      throw new NotFoundException('Investment not found');
    }
    return investment;
  }

  async findAllByUser(userId: string): Promise<InvestmentModel[]> {
    const investments = await this.investmentsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return investments.map((entity) => InvestmentModel.fromEntity(entity));
  }

  async findOneByUser(id: string, userId: string): Promise<InvestmentModel> {
    const investment = await this.findEntityByUser(id, userId);
    return InvestmentModel.fromEntity(investment);
  }

  async create(userId: string, data: CreateInvestmentDto): Promise<InvestmentModel> {
    const investment = this.investmentsRepo.create({ ...data, user_id: userId });
    const saved = await this.investmentsRepo.save(investment);
    return InvestmentModel.fromEntity(saved);
  }

  async update(id: string, userId: string, data: UpdateInvestmentDto | Partial<Investment>): Promise<InvestmentModel> {
    const investment = await this.findEntityByUser(id, userId);
    this.investmentsRepo.merge(investment, data as Partial<Investment>);
    const saved = await this.investmentsRepo.save(investment);
    return InvestmentModel.fromEntity(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.findEntityByUser(id, userId);
    await this.investmentsRepo.remove(investment);
  }

  // Investment Transactions
  async findTransactions(investmentId: string, userId: string): Promise<InvestmentTransactionModel[]> {
    await this.findEntityByUser(investmentId, userId);
    const transactions = await this.investmentTxRepo.find({
      where: { investment_id: investmentId, user_id: userId },
      order: { date: 'DESC' },
    });
    return transactions.map((entity) => InvestmentTransactionModel.fromEntity(entity));
  }

  async createTransaction(
    userId: string,
    data: CreateInvestmentTransactionDto & { investment_id: string },
  ): Promise<InvestmentTransactionModel> {
    await this.findEntityByUser(data.investment_id!, userId);
    const tx = this.investmentTxRepo.create({ ...data, user_id: userId });
    const saved = await this.investmentTxRepo.save(tx);

    // Update investment's avg_buy_price and quantity
    if (data.type === 'buy') {
      const investment = await this.findEntityByUser(data.investment_id!, userId);
      const totalCost =
        Number(investment.quantity) * Number(investment.avg_buy_price) +
        Number(data.quantity) * Number(data.price_per_unit);
      const totalQty = Number(investment.quantity) + Number(data.quantity);
      await this.update(investment.id, userId, {
        quantity: totalQty,
        avg_buy_price: totalQty > 0 ? totalCost / totalQty : 0,
      });
    } else if (data.type === 'sell') {
      const investment = await this.findEntityByUser(data.investment_id!, userId);
      await this.update(investment.id, userId, {
        quantity: Number(investment.quantity) - Number(data.quantity),
      });
    }

    return InvestmentTransactionModel.fromEntity(saved);
  }
}

export const InjectInvestmentsService = (): PropertyDecorator &
  ParameterDecorator => Inject(INVESTMENTS_SERVICE);

export const InvestmentsProvider: Provider = {
  provide: INVESTMENTS_SERVICE,
  useClass: InvestmentsService,
};
