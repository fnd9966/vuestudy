<template>
  <div id='app'>
    <!-- <keep-alive :max="10"> -->
      <router-view :key="key"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    key: function () {
      return this.$route.path
    }
  }
}
</script>

<style>
body, html { height: 100%; width: 100%; padding: 0; margin: 0;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  padding-top: 40px; margin: 0; box-sizing: border-box; -ms-box-sizing: border-box; -moz-box-sizing: border-box; -webkit-box-sizing: border-box;
}
</style>
