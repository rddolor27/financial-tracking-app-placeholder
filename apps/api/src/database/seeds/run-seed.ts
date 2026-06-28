import dataSource from '../data-source';
import { seedCategories } from './category.seed';
import { seedSubscriptionPlans } from './subscription-plan.seed';
import { seedUsers } from './user.seed';
import { seedDemoData } from './demo-data.seed';

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('Database connected for seeding');

    await seedCategories(dataSource);
    await seedSubscriptionPlans(dataSource);
    await seedUsers(dataSource);
    await seedDemoData(dataSource);

    console.log('All seeds completed');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();
