<template>
  <div>
    <div>show tooltip : <mt-switch v-model="showToolTip"></mt-switch></div>
    <div><mt-radio
        title="选择时长"
        v-model="usd"
        :options="['Coinmarketcap', 'Kraken']">
      </mt-radio>
    </div>

    <mt-button type="default" v-on:click="save">保存</mt-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Setup',
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

</style>
