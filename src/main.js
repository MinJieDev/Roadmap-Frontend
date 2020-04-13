// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import VueMindmap from 'vue-mindmap';
import 'vue-mindmap/dist/vue-mindmap.css';

Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.use(VueMindmap);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
