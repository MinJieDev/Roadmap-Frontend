import { reqSingle } from './util';

export const updateUserName = (id, username) => reqSingle(`/api/users/${id}.json`, 'PATCH', { username });

export const updateUserEmail = (id, email) => reqSingle(`/api/users/${id}.json`, 'PUT', { email });

export const updateUserPsw = (id, psw) => reqSingle(`/api/users/${id}.json`, 'PUT', { psw });

export const updateUserCity = (id, city) => reqSingle(`/api/users/${id}.json`, 'PUT', { city });

export const updateUserOrgan = (id, organ) => reqSingle(`/api/users/${id}.json`, 'PUT', { organ });

export const updateUserBio = (id, bio) => reqSingle(`/api/users/${id}.json`, 'PUT', { bio });

export const updateInterest = (id, interest) => reqSingle(`api/users/${id}.json`, 'PUT', { interest });
