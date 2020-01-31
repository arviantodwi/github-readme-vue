<template>
  <div class="container">
    {{ `${$route.params.username}/${$route.params.repos}` }}
    <article class="markdown-body" v-html="mdhtml" style="min-height: 50vh" />
    <b-loading
      :is-full-page="false"
      :active.sync="mdIsFetching"
      :can-cancel="false"
      v-if="mdIsFetching"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IReadme } from '@/types';

const syntaxhl = require('highlight.js');
const mdanchor = require('markdown-it-anchor');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && syntaxhl.getLanguage(lang)) {
      try {
        return syntaxhl.highlight(lang, str).value;
      } catch (__) {
        //
      }
    }

    return ''; // use external default escaping
  }
}).use(mdanchor.default, {
  level: 4,
  permalink: true
});

@Component
export default class Readme extends Vue {
  username: string = '';
  repos: string = '';
  mdhtml: string = '';
  mdIsFetching: boolean = false;

  async created() {
    this.username = this.$route.params.username;
    this.repos = this.$route.params.repos;
    this.mdIsFetching = true;

    const rawmd = await this.$http
      .get(`/repos/${this.username}/${this.repos}/readme`)
      .then(async response => {
        return this.$http
          .get(`${response.data.download_url}`, {
            headers: {
              Accept: 'application/vnd.github.VERSION.raw',
              'Content-Type': 'application/vnd.github.VERSION.raw'
            },
            responseType: 'text'
          })
          .then(response => {
            return response.data;
          })
          .catch(error => {});
      })
      .catch(error => {
        return 404;
      });

    if (rawmd == 404) {
      this.mdhtml = '<h2>README.md not found :(</h2>';
    } else {
      this.mdhtml = md.render(await rawmd);
    }

    this.mdIsFetching = false;

    // console.log(response);
    // console.log(md.render());
  }
}
</script>
