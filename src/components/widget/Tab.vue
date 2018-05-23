<template>
  <div v-show="(this.index + '') === $parent.tabIndex + ''">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: ['index'],
  methods: {
  },
  created: function () {
    console.log(this.index, this.$parent.tabIndex)
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
