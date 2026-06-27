import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepo: Repository<Account>,
  ) {}

  async findAllByUser(userId: string): Promise<Account[]> {
    return this.accountsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<Account> {
    const account = await this.accountsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async create(userId: string, data: Partial<Account>): Promise<Account> {
    const account = this.accountsRepo.create({ ...data, user_id: userId });
    return this.accountsRepo.save(account);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Account>,
  ): Promise<Account> {
    const account = await this.findOneByUser(id, userId);
    this.accountsRepo.merge(account, data);
    return this.accountsRepo.save(account);
  }

  async remove(id: string, userId: string): Promise<void> {
    const account = await this.findOneByUser(id, userId);
    account.is_active = false;
    await this.accountsRepo.save(account);
  }
}
