<template>
  <div>
    <ul class="ui-tab fn-flex">
      <li v-for="(title, index) in titles" :key="index" v-bind:class="isActive(index)" v-on:click="changeTab(index)"><a>{{ title }}</a></li>
    </ul>
    <div class="ui-tab-content">
          <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: ['defaultKey'],
  methods: {
    changeTab: function (key) {
      this.tabIndex = key
    },
    isActive: function (key) {
      return {active: this.tabIndex === key}
    }
  },
  created: function () {
    var children = this.$slots.default
    if (children && children.length > 0) {
      children = children.filter((child) => child.tag !== undefined)
    }
    console.log(children)
    var titles = []
    children.map((child) => {
      titles.push(child.data.attrs.title || '')
    })

    this.titles = titles
  },
  data: function () {
    return {
      titles: [],
      tabIndex: 0
    }
  }
}
</script>

<style scoped>

</style>
