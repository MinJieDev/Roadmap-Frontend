// import Vue from 'vue';
// import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
//
// Vue.use(Router);
// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: () => import(/* webpackChunkName: "about" */ '../views/Index.vue')
//   }
// ]
//
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld,
//     },
//   ],
//
// });
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Layout.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
