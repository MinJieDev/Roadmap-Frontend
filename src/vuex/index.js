import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line no-unused-vars
import cookie from 'vue-cookies';

Vue.use(Vuex);

/* 设置state参数 */
const state = {
  example: 'vuex is backing up',
  txtArr: ['hdlnb', 'hdlswlp'],
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
