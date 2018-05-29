<template>
  <div class="container">
    <Head />
    <div class="content">
      <h2 class="column-title">设置</h2>
      <div>show tooltip</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Head from './Head'

export default {
  name: 'Setup',
  components: {
    Head
  },
  computed: {
    usd: {
      get () {
        return this.$store.state.setting.usd
      },
      set (value) {
        this.$store.commit('updateUsd', value)
      }
    },
    showToolTip: {
      get () {
        return this.$store.state.setting.showToolTip
      },
      set (value) {
        this.$store.commit('updateToolTip', value)
      }
    }
  },
  methods: {
    ...mapActions([
      'saveSetting'
    ]),
    save: function () {
      this.saveSetting({
        showToolTip: this.$store.state.setting.showToolTip,
        usd: this.$store.state.setting.usd
      })
    }
  },
  data: function () {
    return {
    }
  }
}
</script>

<style scoped>
  .content{box-sizing: border-box; max-width: 60em; min-height: 36em; margin: 0 auto; padding: 1.5em 1em; background-color: #fff;}
  .column-title{margin-bottom: 1em; padding: 0.5em 0; font-size: 1.125em;}

  @media screen and (max-width: 480px) {
    .content{padding: 1em 0 0; min-height: auto;}
    .column-title{margin-bottom: 1em; padding: 0.5em 0.625em;}
  }
</style>
