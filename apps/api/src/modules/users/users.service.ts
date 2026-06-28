import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { google_id: googleId } });
  }

  async create(data: Partial<User>): Promise<User> {
    const existing = await this.findByEmail(data.email!);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async getProfile(userId: string): Promise<UserModel> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserModel.fromEntity(user);
  }

  async update(id: string, data: Partial<User>): Promise<UserModel> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.usersRepo.merge(user, data);
    const saved = await this.usersRepo.save(user);
    return UserModel.fromEntity(saved);
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password_hash) {
      throw new BadRequestException('Account uses Google authentication only');
    }
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      throw new BadRequestException('Current password is incorrect');
    }
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.save(user);
  }
}
