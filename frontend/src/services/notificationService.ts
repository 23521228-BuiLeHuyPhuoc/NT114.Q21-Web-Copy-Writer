import { MOCK_NOTIFICATIONS as MOCK_NOTIFICATIONS_FULL } from '@/mocks/notifications';
import { MOCK_NOTIFICATIONS as MOCK_NOTIFICATIONS_HEADER } from '@/mocks/customerHeader';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const notificationService = {
  list: async () => {
    await delay();
    return MOCK_NOTIFICATIONS_FULL;
  },
  listHeader: async () => {
    await delay();
    return MOCK_NOTIFICATIONS_HEADER;
  },
};
