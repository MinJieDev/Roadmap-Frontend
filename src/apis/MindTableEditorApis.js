import { req, reqSingle } from '../apis/util';

// eslint-disable-next-line import/prefer-default-export,camelcase,max-len
export const createMTdata = (title, alias, author, url, journal, years, volume, pages, read_state, ref) => req(
  '/api/articles/', 'POST', {},
  // eslint-disable-next-line max-len
  { title, alias, author, url, journal, years, volume, pages, read_state, article_references: ref });

export const deleteMTdata = id => req(
  `api/articles/${id}/`, 'DELETE');

export const changeMTdata = data => req(
  `api/articles/${data.id}/`, 'PATCH', {}, data);

export const getAllNewPapers = () => req('/api/newpapers/', 'GET', {});

export const getPaperCertainInterest = interest => req(`/api/newpaper/${interest}`, 'GET', {});

export const getUserDetails = () => req('/api/users/', 'GET', {});

export const getArticle = id => reqSingle(`/api/articles/${id}/`, 'GET');

export const updateAlias = (id, alias) => reqSingle(`/api/articles/${id}/`, 'PATCH', { alias });
