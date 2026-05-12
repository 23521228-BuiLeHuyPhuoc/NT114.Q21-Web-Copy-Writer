import { MOCK_PAYMENTS, REVENUE_DATA } from '@/mocks/payments';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const paymentService = {
  list: async () => {
    await delay();
    return MOCK_PAYMENTS;
  },
  getRevenue: async () => {
    await delay();
    return REVENUE_DATA;
  },
};
