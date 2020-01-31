import Vue from 'vue';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://api.github.com`
});

Vue.prototype.$http = axiosInstance;
