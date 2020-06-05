import Vue from 'vue';
import Vuex from 'vuex';
import cookie from 'vue-cookies';

Vue.use(Vuex);

/* 设置state参数 */
const state = {
  example: 'vuex is backing up',
  txtArr: ['hdlnb', 'hdlswlp'],
  authToken: cookie.get('authToken'),
  roadMapTable: cookie.get('roadMapTable'),
};

const getters = {
  // eslint-disable-next-line no-shadow
  getFirstTxtArr(state) {
    if (state.txtArr.length !== 0) { return state.txtArr[0]; }
    return '';
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  pushTxtArr(state, str) {
    state.txtArr.push(str);
  },
  popTxtArr() {
    state.txtArr.pop();
  },
  // eslint-disable-next-line no-shadow
  pushAuthToken(state, authToken) {
    state.authToken = authToken;
    cookie.set('authToken', authToken);
  },
  // eslint-disable-next-line no-shadow
  pushRoadMapTable(state, style) {
    state.roadMapTable = style;
    cookie.set('roadMapTable', style);
  },
};

const actions = {

};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});

export default store;
