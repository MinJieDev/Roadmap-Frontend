import axios from 'axios';


// eslint-disable-next-line import/prefer-default-export
export const req = (url, _method, params = {}, data = {}) => {
  const method = _method.toUpperCase();
  let options;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    options = {
      method,
      url,
      params,
      data,
    };
  } else {
    options = {
      method,
      url,
      params,
    };
  }
  try {
    return axios(options);
  } catch (e) {
    throw e;
  }
};
