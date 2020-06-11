import { reqSingle } from './util';

export const updateUserName = (id, username) => reqSingle(`/api/users/${id}.json`, 'PATCH', { username });

export const updateUserEmail = (id, email) => reqSingle(`/api/users/${id}.json`, 'PUT', { email });

export const updateUserCity = (id, city) => reqSingle(`/api/users/${id}.json`, 'PUT', { city });

export const updateUserOrgan = (id, organization) => reqSingle(`/api/users/${id}.json`, 'PUT', { organization });

export const updateUserBio = (id, bio) => reqSingle(`/api/users/${id}.json`, 'PUT', { bio });

export const updateInterest = (id, interest) => reqSingle(`/api/users/${id}.json`, 'PUT', { interest });

export const getUser = () => reqSingle('/api/users/', 'GET');
