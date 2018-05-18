<template>
  <div id="app">
    <transition>
      <router-view/>
    </transition>
  </div>
</template>

<script>
import './assets/styles/iconfont.css'
export default {
  name: 'App'
}
</script>

<style>
#app {
  overflow: hidden;
}
</style>
