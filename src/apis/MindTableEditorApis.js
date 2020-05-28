import { req } from '../apis/util';

// eslint-disable-next-line import/prefer-default-export,camelcase,max-len
export const createMTdata = (title, author, url, journal, years, volume, pages, read_state, ref) => req(
  '/api/articles/', 'POST', {},
  { title, author, url, journal, years, volume, pages, read_state, article_references: ref });

export const deleteMTdata = id => req(
  `api/articles/${id}/`, 'DELETE');

export const changeMTdata = data => req(
  `api/articles/${data.id}/`, 'PATCH', {}, data);
