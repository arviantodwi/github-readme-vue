<template>
  <div class="container">
    <div style="position: relative; min-height: 50vh;">
      <b-loading
        :is-full-page="false"
        :active.sync="reposIsFetching"
        :can-cancel="false"
        v-if="reposIsFetching"
      />
      <template v-for="item in repos">
        <div :key="item.id">
          <router-link
            :to="{ name: 'readme', params: { repos: item.name } }"
            class="subtitle"
            style="color: #7957d5"
            >{{ item.name }}
          </router-link>
          <p>{{ item.description }}</p>
        </div>
        <hr :key="`r-${item.id}`" />
      </template>
      <b-pagination
        :current.sync="page"
        :per-page="pageItems"
        :range-after="2"
        :range-before="2"
        :total="pageTotalItems"
        @change="getRepos"
        aria-current-label="Current page"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
      >
        <b-pagination-button
          :id="`page${props.page.number}`"
          :page="props.page"
          :to="{
            name: 'repos',
            params: { username: $route.params.username },
            query: { page: props.page.number }
          }"
          slot-scope="props"
          tag="router-link"
        >
          {{ props.page.number }}
        </b-pagination-button>

        <b-pagination-button
          :page="props.page"
          :tag="
            pageTotalItems > 10 && props.page.number > 0
              ? 'router-link'
              : 'button'
          "
          :to="
            pageTotalItems > 10 && props.page.number > 0
              ? {
                  name: 'repos',
                  params: { username: $route.params.username },
                  query: { page: props.page.number }
                }
              : null
          "
          slot="previous"
          slot-scope="props"
        >
          <b-icon icon="long-arrow-alt-left" size="is-small" />
        </b-pagination-button>

        <b-pagination-button
          :page="props.page"
          :tag="
            pageTotalItems > 10 && pageTotalItems / props.page.number >= 10
              ? 'router-link'
              : 'button'
          "
          :to="
            pageTotalItems > 10 && pageTotalItems / props.page.number >= 10
              ? {
                  name: 'repos',
                  params: { username: $route.params.username },
                  query: { page: props.page.number }
                }
              : null
          "
          slot="next"
          slot-scope="props"
        >
          <b-icon icon="long-arrow-alt-right" size="is-small" />
        </b-pagination-button>
      </b-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
import { IRepos } from '../types';

const parseLinkHeader = require('parse-link-header');

@Component
export default class Projects extends Vue {
  currentUser: string = '';
  repos: IRepos[] = [];
  reposIsFetching: boolean = false;
  page: number = 1;
  pageItems: number = 10;
  pageTotalItems: number | null = null;

  // mounted() {
  //   this.getRepos();
  // }

  created() {
    this.currentUser = this.$route.params.username;
    this.getRepos();
  }

  @Watch('$route')
  getRepos() {
    this.reposIsFetching = true;

    if (typeof this.$route.query.page !== 'undefined') {
      let pageQS = parseInt(this.$route.query.page as string, 10);
      this.page = isNaN(pageQS) ? 1 : pageQS;
    } else {
      this.page = 1;
    }

    if (
      this.currentUser !== '' &&
      this.$route.params.username != this.currentUser
    ) {
      this.currentUser = this.$route.params.username;
      this.pageTotalItems = null;
    }

    this.$http
      .get(
        `/users/${this.currentUser}/repos?page=${this.page}&per_page=${this.pageItems}`
      )
      .then(response => {
        let items = [];
        for (let i in response.data) {
          items.push(response.data[i]);
        }
        if (this.repos.length) {
          this.repos.splice(0, this.repos.length);
        }
        this.repos = this.repos.concat(items);

        let page;
        let lastLink = parseLinkHeader(response.headers.link).last;
        if (typeof lastLink === 'undefined') {
          lastLink = parseLinkHeader(response.headers.link).prev;
          page = parseInt(lastLink.page, 10) + 1;
        } else {
          page = parseInt(lastLink.page, 10);
        }
        this.pageTotalItems = page * this.pageItems;
      })
      .catch(error => {})
      .finally(() => {
        this.reposIsFetching = false;
      });
  }
}
</script>
