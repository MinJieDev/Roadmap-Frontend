import _ from 'lodash';
import { req, reqSingle } from '../apis/util';

// export const createMDnote = (title, note) => req('/api/essays/',
//   'POST', {}, { title, text: note });
function splashEnd(id) {
  let idSplash = id;
  if (!_(id).endsWith('/')) {
    idSplash = `${id}/`;
  }
  return idSplash;
}

export const deleteEssay = id => reqSingle(`api/essays/${id}.json`, 'DELETE');

export const getEssay = id => reqSingle(`/api/essays/${id}.json`, 'GET');

export const changeEssay = data => reqSingle(`/api/essays/${data.id}.json`, 'PATCH', data);

export const postEssayShareLink = id => req('/api/share/essay/', 'POST', {}, { id });

export const getEssayShareLink = id => req(`/api/share/essay/${splashEnd(id)}`, 'GET');

export const putCommentSHA = (id, comment) => reqSingle(`/api/essays/${splashEnd(id)}`, 'PUT', { comment });

export const putCommentId = (id, comment) => reqSingle(`/api/essays/${id}.json`, 'PUT', { comment });

export const putLikeSHA = id => reqSingle(`/api/essay_like/${splashEnd(id)}`, 'PUT', { action: 'like' });

export const putUnlikeSHA = id => reqSingle(`/api/essay_like/${splashEnd(id)}`, 'PUT', { action: 'unlike' });
