<template>
  <div
    class="home"
    style="justify-content: center; align-items: center; display: flex; flex-direction: column; height: 50vh;"
  >
    <div>
      <b-icon icon="github" pack="fab" />
      <b-icon icon="markdown" pack="fab" />
    </div>
    <h1 class="title" style="color: #2c3e50; opacity: .66; margin-top: .25em;">
      Github Readme
    </h1>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>

<style lang="scss">
.home {
  .icon {
    width: 128px;
    height: 128px;
    padding: 8px;

    > svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
