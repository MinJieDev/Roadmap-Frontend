import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/WelcomeCardView.vue'),
    meta: {
      nickName: '主页',
      level: 1,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/UserLoginView.vue'),
    meta: {
      nickName: '登录',
      level: 2,
    },
  },
  {
    path: '/articleTable',
    name: 'ArticleTable',
    component: () => import(/* webpackChunkName: "about" */ '../views/ArticleTableView.vue'),
    meta: {
      nickName: '文献目录',
      name: ['文献目录'],
      path: ['/articleTable'],
      level: 2,
    },
  },
  {
    path: '/articleMde',
    name: 'ArticleMarkDownEditor',
    component: () => import('../views/MarkDownEditorView'),
    meta: {
      nickName: '文献笔记',
      name: ['文献目录', '文献笔记'],
      path: ['/articleTable', '/articleMde'],
      level: 10,
    },
  },
  {
    path: '/user_register',
    name: 'Register',
    component: () => import('../views/UserRegisterView'),
    meta: {
      nickName: '注册',
      level: 2,
    },
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoadmapEditorView.vue'),
    meta: {
      nickName: '路书编辑',
      name: ['路书目录', '路书编辑页'],
      path: ['/RoadmapTable', '/editor'],
      level: 5,
    },
  },
  {
    path: '/essayTable',
    name: 'EssayTable',
    component: () => import(/* webpackChunkName: "about" */ '../views/EssayTableView.vue'),
    meta: {
      nickName: '随笔目录',
      name: ['随笔目录'],
      path: ['/essayTable'],
      level: 2,
    },
  },
  {
    path: '/RoadMapTable',
    name: 'RoadmapTable',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoadmapTableView'),
    meta: {
      nickName: '路书目录',
      name: ['路书目录'],
      path: ['/RoadmapTable'],
      level: 2,
    },
  },
  {
    path: '/reader',
    name: 'Reader',
    component: () => import(/* webpackChunkName: "about" */ '../views/RoadmapReaderView.vue'),
    meta: {
      nickName: '路书阅览',
      name: ['路书目录', '路书阅览'],
      path: ['/RoadmapTable', '/reader'],
      level: 5,
    },
  },
  {
    path: '/essayReader',
    name: 'EssayReader',
    component: () => import(/* webpackChunkName: "about" */ '../views/EssayReaderView.vue'),
    meta: {
      nickName: '随笔阅览',
      name: ['随笔目录', '随笔阅览'],
      path: ['/essayTable', '/essayReader'],
      level: 5,
    },
  },
  {
    path: '/essayEditor',
    name: 'EssayEditor',
    component: () => import(/* webpackChunkName: "about" */ '../views/EssayEditor.vue'),
    meta: {
      nickName: '随笔编辑',
      name: ['随笔目录', '路书编辑'],
      path: ['/RoadmapTable', '/editor'],
      level: 5,
    },
  },
  {
    path: '/essayRoadmapReader',
    name: 'EssayRoadmapReader',
    component: () => import(/* webpackChunkName: "about" */ '../views/EssayRoadmapBindReader.vue'),
    meta: {
      nickName: '随笔阅览',
      name: ['随笔目录', '随笔阅览'],
      path: ['/essayTable', '/essayReader'],
      level: 5,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
