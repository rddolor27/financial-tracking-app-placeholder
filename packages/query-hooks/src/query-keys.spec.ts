import { queryKeys } from './query-keys';

describe('queryKeys', () => {
  it('should generate account list keys with filters', () => {
    const key = queryKeys.accounts.list({ type: 'savings' });
    expect(key).toEqual(['accounts', 'list', { type: 'savings' }]);
  });

  it('should generate account detail key', () => {
    expect(queryKeys.accounts.detail('abc-123')).toEqual([
      'accounts',
      'detail',
      'abc-123',
    ]);
  });

  it('should generate transaction search key', () => {
    expect(queryKeys.transactions.search('grocery')).toEqual([
      'transactions',
      'search',
      'grocery',
    ]);
  });

  it('should generate static keys', () => {
    expect(queryKeys.auth.me).toEqual(['auth', 'me']);
    expect(queryKeys.subscription.plans).toEqual(['subscription', 'plans']);
    expect(queryKeys.exchangeRates.all).toEqual(['exchangeRates']);
  });

  it('should generate insight keys with params', () => {
    const key = queryKeys.insights.spendingByCategory({ period: 'monthly' });
    expect(key).toEqual([
      'insights',
      'spendingByCategory',
      { period: 'monthly' },
    ]);
  });
});
