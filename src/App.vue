<template>
  <div id="app">
    <div class="container">
      <div id="nav">
        <router-link to="/">Home</router-link>
      </div>
    </div>

    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <div class="card">
            <div class="card-content">
              <div class="container">
                <b-field label="Find Github user">
                  <b-autocomplete
                    :data="usernameSuggestion"
                    :open-on-focus="true"
                    :loading="usernameIsFetching"
                    @select="option => (usernameSelected = option)"
                    @typing="debouncedGetUsername"
                    field="login"
                    placeholder="e.g. anne"
                    v-model="username"
                  >
                    <template slot-scope="props">
                      <div
                        class="media"
                        style="display: flex; align-items: center;"
                      >
                        <div class="media-left" style="height: 32px;">
                          <img width="32" :src="`${props.option.avatar_url}`" />
                        </div>
                        <div class="media-content">
                          {{ props.option.login }}
                        </div>
                      </div>
                    </template>
                  </b-autocomplete>
                </b-field>
                <hr />
                <div class="field">
                  <p class="label">Last 5 Github users</p>
                  <div>
                    <div v-for="item in usernameHistory" :key="item.login">
                      <router-link
                        :to="{
                          name: 'repos',
                          params: { username: item.login }
                        }"
                      >
                        {{ item.login }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import { IUser, IRepos } from '@/types';

@Component
export default class App extends Vue {
  username: string = '';
  usernameSuggestion: IUser[] = [];
  usernameHistory: IUser[] = [];
  usernameIsFetching: boolean = false;
  usernameSelected: IUser | null = null;
  debouncedGetUsername: any = null;
  // @Prop() readonly repos!: IRepos[];
  // repos: IRepos[] = [];

  created() {
    this.debouncedGetUsername = debounce(this.getUsername, 500);
  }

  @Watch('usernameSelected')
  onUsernameSelect(user: IUser | null, oldUser: IUser | null): void {
    if (user === null) return;

    this.setUsernameHistory(user);
    this.$router.push({ name: 'repos', params: { username: user.login } });
    // this.getRepos(user);
  }

  getUsername() {
    this.usernameSuggestion.splice(0, this.usernameSuggestion.length);
    if (!this.username.length) return;

    this.usernameIsFetching = true;
    this.$http
      // .get(`https://api.github.com/users/${username}`)
      .get(
        `https://api.github.com/search/users?q=${this.username.toLowerCase()}`
      )
      .then(response => {
        if (!response.data.items.length && this.username.length) {
          //
        }

        const data = response.data.items;
        data.forEach((user: IUser) => {
          const login = user.login.toLowerCase();
          if (login.indexOf(this.username.toLowerCase()) > -1) {
            this.usernameSuggestion.push(user);
          }
        });
        console.log(this.usernameSuggestion);
      })
      .catch(error => {})
      .finally(() => {
        this.usernameIsFetching = false;
      });
  }

  setUsernameHistory(user: IUser) {
    const existingFound = find(
      this.usernameHistory,
      obj => obj.login == user.login
    );
    if (typeof existingFound === 'undefined') {
      if (this.usernameHistory.length == 5) {
        this.usernameHistory.splice(this.usernameHistory.length - 1, 1);
      }
      this.usernameHistory.splice(0, 0, user);
    } else {
      const existingIndex = this.usernameHistory.indexOf(existingFound);
      this.usernameHistory.splice(existingIndex, 1);
      this.usernameHistory.unshift(existingFound);
    }

    // console.log(this.usernameHistory);
  }

  // getRepos(user: IUser) {
  //   // if (!this.username.length) return;
  //   // this.$router.push({ name: 'user', params: { username: user.login } });
  //   this.$http
  //     .get(`/users/${user.login}/repos`)
  //     .then(response => {
  //       for (let i in response.data) {
  //         this.repos.push(response.data[i] as IRepos);
  //       }
  //       console.log(this.repos);
  //     })
  //     .catch(error => {});
  // }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
