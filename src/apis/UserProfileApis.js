import { reqSingle } from './util';

export const updateUserName = (id, username) => reqSingle(`/api/users/${id}.json`, 'PATCH', { username });

export const updateUserEmail = (id, email) => reqSingle(`/api/users/${id}.json`, 'PUT', { email });

export const updateUserPsw = (id, username) => reqSingle(`/api/users/${id}.json`, 'PUT', { username });

export const updateInterest = (id, interest) => reqSingle(`api/users/${id}.json`, 'PUT', { interest });
