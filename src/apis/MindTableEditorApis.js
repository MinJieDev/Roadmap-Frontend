import { req } from '../apis/util';

// eslint-disable-next-line import/prefer-default-export
export const createMTdata = (title, author, url, journal, ref) => req(
  '/api/articles/', 'POST', {},
  { title, author, url, journal, article_references: ref });

export const deleteMTdata = id => req(
  `api/articles/${id}/`, 'DELETE');

export const changeMTdata = data => req(
  `api/articles/${data.id}/`, 'PATCH', {}, data);
