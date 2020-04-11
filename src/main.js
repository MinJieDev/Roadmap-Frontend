import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import VueMindmap from 'vue-mindmap'
import 'vue-mindmap/dist/vue-mindmap.css'

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(VueMindmap)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
