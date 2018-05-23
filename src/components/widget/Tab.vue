<template>
<div>
  <ul class="ui-tab wallet-tab fn-flex">
    <li v-for="(title, index) in titles" :key="index" v-bind:class="isActive(title.key)" v-on:click="changeTab(title.key)"><a>{{ title.text }} {{title}}</a></li>
  </ul>
  <div class="ui-tab-content">
    <slot name="find">sss</slot>
  </div>
</div>
</template>

<script>
export default {
  name: 'Tab',
  props: ['titles', 'defaultKey'],
  methods: {
    changeTab: function (key) {
      console.log(this.$slots.default, key)
      this.tabKey = key
    },
    isActive: function (key) {
      return {active: this.tabKey === key}
    }
  },
  created: function () {
    // this.tabs = this.$slots
  },
  data: function () {
    return {
      tabKey: this.defaultKey
      // tabs: []
    }
  }
}
</script>

<style scoped>

</style>
