<template>
  <div class="tool-slide" v-if="showTools">
    <div class="tool-arrow"><i class="iconfont icon-arrow"></i></div>
    <ul class="tool-list" v-on-clickaway="away">
      <li v-for="(item, index) in items" :key="index"><router-link v-bind:to="item.route" class="fn-flex"><span>{{item.text}}</span><i class="iconfont icon-angle"></i></router-link></li>
    </ul>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

const values = [
  {text: '资产', route: '/asset'},
  {text: '管理钱包', route: '/wallet_list'},
  {text: '设置', route: '/setup'}
]

export default {
  name: 'DropMenu',
  mixins: [ clickaway ],
  props: ['showTools'],
  created: function () {

  },
  data: function () {
    return {
      items: values
    }
  },
  methods: {
    away: function () {
      this.$emit('away')
    }
  }
}
</script>

<style scoped>
.tool-slide{position: absolute; z-index: 10; right: -0.625em;}
.tool-list{width: 8em; background-color: #fff; box-shadow: 0 0 5px rgba(0,0,0,.2), 0 0 5px rgba(0,0,0,.2);}
.tool-arrow{position: absolute; right: 0.5em; top: -0.2em; z-index: 9; color: #fff; text-shadow: rgba(0,0,0,.25) 0 -0.07em 0.1em;font-size: 1.25em; line-height: 0;}
.tool-list li{border-top: 1px solid #f0f0f0; font-size: 0.875em; line-height: 150%;}
.tool-list li .fn-flex{justify-content: space-between; padding: 0.875em 0.625em;}
.tool-list li i{font-size: 0.625em; color: #9e9e9e;}
</style>
