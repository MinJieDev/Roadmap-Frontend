import { req } from '../apis/util';

export const createMDnote = title => req('/api/essays/', 'POST', {}, { title });

export const deleteMDnote = id => req(`api/essays/${id}/`, 'DELETE');

export const changeMDnote = data => req(`api/essays/${data.id}/`, 'PATCH', {}, data);
