import { req } from '../apis/util';

export const createMDeditor = title => req('/api/essays/', 'POST', {}, { title });

export const deleteMTdata = id => req(`api/essays/${id}/`, 'DELETE');

export const changeMTdata = data => req(`api/essays/${data.id}/`, 'PATCH', {}, data);
