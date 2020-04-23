import { req } from '../apis/util';


// eslint-disable-next-line import/prefer-default-export
export const createMTdata = (title, author, url, ref) => req(
  '/api/articles/', 'POST', {},
  { title, author, url, article_references: ref });

export const deleteMTdata = id => req(
  `api/articles/${id}/`, 'DELETE');

export const updataMTdata = (id, title, author, url, ref) => req(
  `api/articles/${id}/`, 'PATCH', {},
  { title, author, url, article_references: ref });
