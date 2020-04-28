import axios from 'axios';
import store from '../vuex/index';
import router from '../router';

// axios with interceptor
// eslint-disable-next-line no-unused-vars
const instanceNoAuth = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

instanceNoAuth.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response) {
      // code: 错误状态码， response：错误响应信息，error：原始错误信息
      switch (error.response.status) {
        case 400:
          return Promise.reject({ code: 400, response: error.response, error }); // 客户端请求有语法错误
        case 401:
          return Promise.reject({ code: 401, response: error.response, error }); // 请求未经授权
        case 404:
          return Promise.reject({ code: 404, response: error.response, error }); // 页面未找到
        case 403:
          return Promise.reject({ code: 403, response: error.response, error }); // Bad Gateway
        case 500:
          return Promise.reject({ code: 500, response: error.response, error }); // Server Error
        default:
          return Promise.reject({ code: -1, response: error.response, error }); // 不常见错误
      }
    } else {
      return Promise.reject({ code: -1, response: {}, error });
    }
  },
);

// eslint-disable-next-line no-unused-vars
const instanceAuth = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

instanceAuth.interceptors.request.use(
  (config) => {
    const configTemp = config;
    configTemp.headers.Authorization = store.state.authToken;
    return configTemp;
  },
  error => Promise.reject(error),
);

instanceAuth.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response) {
      // code: 错误状态码， response：错误响应信息，error：原始错误信息
      switch (error.response.status) {
        case 400:
          return Promise.reject({ code: 400, response: error.response, error }); // 客户端请求有语法错误
        case 401: // 请求未经授权
        {
          router.push({ name: 'Login' });
          return Promise.reject({ code: 401, response: error.response, error });
        }
        case 404:
          return Promise.reject({ code: 404, response: error.response, error }); // 页面未找到
        case 403:
          return Promise.reject({ code: 403, response: error.response, error }); // Bad Gateway
        case 500:
          return Promise.reject({ code: 500, response: error.response, error }); // Server Error
        default:
          return Promise.reject({ code: -1, response: error.response, error }); // 不常见错误
      }
    } else {
      return Promise.reject({ code: -1, response: {}, error });
    }
  },
);

// 需要认证Token的Request方法
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
  return instanceAuth(options);
};

// 需要认证Token的Request方法，将data和params两个参数进行了合并。
// eslint-disable-next-line camelcase,no-undef
export const reqSingle = (url, _method, params_or_data = {}) => {
  const method = _method.toUpperCase();
  let options;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    options = {
      method,
      url,
      data: params_or_data,
    };
  } else {
    options = {
      method,
      url,
      params: params_or_data,
    };
  }
  return instanceAuth(options);
};

// 无需认证Token的Request方法。
// eslint-disable-next-line camelcase
export const reqNoAuth = (url, _method, params_or_data = {}) => {
  const method = _method.toUpperCase();
  let options;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    options = {
      method,
      url,
      data: params_or_data,
    };
  } else {
    options = {
      method,
      url,
      params: params_or_data,
    };
  }
  return instanceNoAuth(options);
};
