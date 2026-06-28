import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { AccountModel } from './models/account.model';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepo: Repository<Account>,
  ) {}

  private async findEntityByUser(id: string, userId: string): Promise<Account> {
    const account = await this.accountsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async findAllByUser(userId: string): Promise<AccountModel[]> {
    const accounts = await this.accountsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return accounts.map((account) => AccountModel.fromEntity(account));
  }

  async findOneByUser(id: string, userId: string): Promise<AccountModel> {
    const account = await this.findEntityByUser(id, userId);
    return AccountModel.fromEntity(account);
  }

  async create(userId: string, data: CreateAccountDto): Promise<AccountModel> {
    const account = this.accountsRepo.create({ ...data, user_id: userId });
    const saved = await this.accountsRepo.save(account);
    return AccountModel.fromEntity(saved);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateAccountDto | Partial<Account>,
  ): Promise<AccountModel> {
    const account = await this.findEntityByUser(id, userId);
    this.accountsRepo.merge(account, data as Partial<Account>);
    const saved = await this.accountsRepo.save(account);
    return AccountModel.fromEntity(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const account = await this.findEntityByUser(id, userId);
    account.is_active = false;
    await this.accountsRepo.save(account);
  }
}
