import { req } from '../apis/util';

export const createMDnote = (title, note) => req('/api/essays/',
  'POST', {}, { title, text: note });

export const deleteMDnote = id => req(`api/essays/${id}/`, 'DELETE');

export const changeMDnote = data => req(`api/essays/${data.id}/`, 'PATCH', {}, data);
