import { req, reqSingle } from '../apis/util';

// export const createMDnote = (title, note) => req('/api/essays/',
//   'POST', {}, { title, text: note });

export const deleteEssay = id => reqSingle(`api/essays/${id}.json`, 'DELETE');

export const getEssay = id => reqSingle(`/api/essays/${id}.json`, 'GET');

export const changeEssay = data => reqSingle(`/api/essays/${data.id}.json`, 'PATCH', data);

export const postEssayShareLink = id => req('/api/share/essay/', 'POST', {}, { id });

export const getEssayShareLink = id => req(`/api/share/essay/${id}`, 'GET');

export const putCommentSHA = (id, comment) => reqSingle(`/api/essays/${id}`, 'PUT', { comment });

export const putCommentId = (id, comment) => reqSingle(`/api/essays/${id}.json`, 'PUT', { comment });
