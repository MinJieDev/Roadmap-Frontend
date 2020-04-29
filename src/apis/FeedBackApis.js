import { req } from '../apis/util';

// eslint-disable-next-line import/prefer-default-export
export const createFeedBack = (email, rating, feedback) => req('/api/feedback/', 'POST', {},
  { text: JSON.stringify({ email, rating, feedback }) });
