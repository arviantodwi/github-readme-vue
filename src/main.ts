import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import '@/boot/axios';
import 'github-markdown-css';
import 'highlight.js/styles/atom-one-light.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faLongArrowAltRight,
  faLongArrowAltLeft
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faMarkdown } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.config.productionTip = false;

library.add(faGithub, faLongArrowAltRight, faLongArrowAltLeft, faMarkdown);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas'
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
