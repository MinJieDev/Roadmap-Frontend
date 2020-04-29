import store from '../vuex/index';
import router from '../router';

// eslint-disable-next-line import/prefer-default-export
export const logout = () => {
  store.commit('pushAuthToken', '');
  router.push('/user_login');
};

export const isLogin = () => store.state.authToken === '' || store.state.authToken === undefined;
