import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Subscription } from './subscription.entity';
import { Payment } from './payment.entity';

const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let plansRepo: ReturnType<typeof mockRepo>;
  let subsRepo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: getRepositoryToken(SubscriptionPlan), useFactory: mockRepo },
        { provide: getRepositoryToken(Subscription), useFactory: mockRepo },
        { provide: getRepositoryToken(Payment), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    plansRepo = module.get(getRepositoryToken(SubscriptionPlan));
    subsRepo = module.get(getRepositoryToken(Subscription));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return active plans', async () => {
    plansRepo.find.mockResolvedValue([{ id: '1', name: 'Premium', is_active: true }]);
    const plans = await service.getPlans();
    expect(plans).toHaveLength(1);
  });

  it('should throw NotFoundException for invalid plan', async () => {
    plansRepo.findOne.mockResolvedValue(null);
    await expect(service.getPlanById('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should return free features when no subscription', async () => {
    subsRepo.findOne.mockResolvedValue(null);
    const features = await service.getUserFeatures('u1');
    expect(features.investments).toBe(false);
    expect(features.pdf_parsing).toBe(false);
  });

  it('should check feature access', async () => {
    subsRepo.findOne.mockResolvedValue({
      plan: { features: { investments: true, pdf_parsing: false } },
    });
    expect(await service.hasFeature('u1', 'investments')).toBe(true);
    expect(await service.hasFeature('u1', 'pdf_parsing')).toBe(false);
  });
});
