import store from '../vuex/index';

// eslint-disable-next-line import/prefer-default-export
export const logout = () => {
  store.commit('pushAuthToken', '');
};

export const isLogin = () => !(store.state.authToken === ''
  || store.state.authToken === undefined
  || store.state.authToken === null);
