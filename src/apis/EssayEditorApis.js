import { req, reqSingle } from '../apis/util';

// export const createMDnote = (title, note) => req('/api/essays/',
//   'POST', {}, { title, text: note });

export const deleteEssay = id => reqSingle(`api/essays/${id}/`, 'DELETE');

export const getEssay = id => reqSingle(`api/essays/${id}/`, 'GET');

export const changeEssay = data => reqSingle(`api/essays/${data.id}/`, 'PATCH', data);

export const postEssayShareLink = id => req('/api/share/essay/', 'POST', {}, { id });

export const getEssayShareLink = id => req(`/api/share/essay/${id}`, 'GET');
