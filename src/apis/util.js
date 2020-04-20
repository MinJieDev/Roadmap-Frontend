import axios from 'axios';

// axios with interceptor
// eslint-disable-next-line no-unused-vars
const instance = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

instance.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return Promise.reject({ error: 400, response: error.response }); // 客户端请求有语法错误
        case 401:
          return Promise.reject({ error: 401, response: error.response }); // 请求未经授权
        case 404:
          return Promise.reject({ error: 404, response: error.response }); // 页面未找到
        case 403:
          return Promise.reject({ error: 403, response: error.response }); // Bad Gateway
        case 500:
          return Promise.reject({ error: 500, response: error.response }); // Server Error
        default:
          return Promise.reject({ error: -1, response: error.response }); // 不常见错误
      }
    } else {
      return error;
    }
  },
);

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
  return instance(options);
};
