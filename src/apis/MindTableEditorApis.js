import { req, reqSingle } from '../apis/util';

// eslint-disable-next-line import/prefer-default-export
export const createMTdata = (title, author, url, note, journal, ref) => req(
  '/api/articles/', 'POST', {},
  { title, author, url, note, journal, article_references: ref });

export const deleteMTdata = id => req(
  `api/articles/${id}/`, 'DELETE');

export const changeMTdata = data => req(
  `api/articles/${data.id}/`, 'PATCH', {}, data);

export const getAllNewPapers = () => req('/api/newpapers/', 'GET', {});

export const getArticle = id => reqSingle(`/api/articles/${id}/`, 'GET');
