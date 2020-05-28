import { reqSingle } from './util';

// eslint-disable-next-line import/prefer-default-export
export const changeUserData = data => reqSingle(`api/users/${data.id}/`, 'PUT', data);
