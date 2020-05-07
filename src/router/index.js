import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/UserLoginView.vue'),
  },
  {
    path: '/articleTable',
    name: 'ArticleTable',
    component: () => import(/* webpackChunkName: "about" */ '../views/ArticleTableView.vue'),
    meta: {
      name: ['文献目录'],
      path: ['/articleTable'],
    },
  },
  {
    path: '/articleMde',
    name: 'ArticleMarkDownEditor',
    component: () => import('../views/MarkDownEditorView'),
    meta: {
      name: ['文献目录', '文献笔记'],
      path: ['/articleTable', '/articleMde'],
    },
  },
  {
    path: '/user_register',
    name: 'Register',
    component: () => import('../views/UserRegisterView'),
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoadmapEditorView.vue'),
    meta: {
      name: ['路书目录', '路书编辑页'],
      path: ['/RoadmapTable', '/editor'],
    },
  },
  {
    path: '/RoadMapTable',
    name: 'RoadmapTable',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoadmapTableView'),
    meta: {
      name: ['路书目录'],
      path: ['/RoadmapTable'],
    },
  },
  {
    path: '/reader',
    name: 'Reader',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoadmapReaderView.vue'),
    meta: {
      name: ['路书目录', '路书阅览'],
      path: ['/RoadmapTable', '/reader'],
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
