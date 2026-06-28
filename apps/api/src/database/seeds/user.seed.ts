import type { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/user.entity';

const DEMO_PASSWORD = 'Home@1234';

const DEMO_USERS = [
  {
    email: 'admin@financialtracker.com',
    first_name: 'Admin',
    last_name: 'User',
    auth_provider: 'email' as const,
    currency: 'PHP',
  },
  {
    email: 'demo@financialtracker.com',
    first_name: 'Demo',
    last_name: 'User',
    auth_provider: 'email' as const,
    currency: 'PHP',
  },
];

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(User);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  for (const userData of DEMO_USERS) {
    const existing = await repo.findOne({ where: { email: userData.email } });

    if (!existing) {
      await repo.save(
        repo.create({
          ...userData,
          password_hash: passwordHash,
        }),
      );
    }
  }

  console.log(`Seeded ${DEMO_USERS.length} demo users`);
}
