import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import User from '@/views/User.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    children: [
      {
        path: ':username',
        name: 'repos',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "repos" */ '../components/Repos.vue')
      },
      {
        path: ':username/:repos/md',
        name: 'readme',
        component: () =>
          import(/* webpackChunkName: "readme" */ '../components/Readme.vue')
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
