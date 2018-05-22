<template>
  <div class="head">
    <div class="navbar fn-flex">
      <div class="navbar-left fn-flex">
        <i class="iconfont icon-wallet logo"></i>
        <h1>钱包WALLET</h1>
      </div>
      <div class="navbar-right">
        <div class="navbar-right-select" v-on:click="showPop">管理<i class="iconfont icon-list"></i></div>
        <div class="tool-slide" v-if="showTools">
          <div class="tool-arrow"><i class="iconfont icon-arrow"></i></div>
          <ul class="tool-list" v-on-clickaway="away">
            <li><router-link to="/wallet_list" class="fn-flex"><span>管理钱包</span><i class="iconfont icon-angle"></i></router-link></li>
            <li><router-link to="/wallet_list" class="fn-flex"><span>设置</span><i class="iconfont icon-angle"></i></router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'Head',
  mixins: [ clickaway ],
  methods: {
    showPop: function () {
      this.showTools = !this.showTools
    },
    away: function () {
      this.showTools = false
    }
  },
  data () {
    return {
      showTools: false
    }
  }
}
</script>

<style scoped>
  .head{background-color: #fff; box-shadow: 0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05); position: relative; z-index: 1;}
  .navbar{box-sizing: border-box; height: 3.5em; max-width: 60em; padding: 0 0.625em; margin: 0 auto; line-height: 3.5em; justify-content: space-between;}
  .navbar .logo{font-size: 1.5em; color: #2196f3;}
  h1{margin-left: 0.35em; font-size: 1.25em;}
  .navbar-right{position: relative; z-index: 1;}
  .navbar-right-select i{margin-left: 0.35em; color: #999;}
  .tool-slide{position: absolute; z-index: 10; right: -0.625em;}
  .tool-list{width: 8em; background-color: #fff; box-shadow: 0 0 5px rgba(0,0,0,.2), 0 0 5px rgba(0,0,0,.2);}
  .tool-arrow{position: absolute; right: 0.5em; top: -0.2em; z-index: 9; color: #fff; text-shadow: rgba(0,0,0,.25) 0 -0.07em 0.1em;font-size: 1.25em; line-height: 0;}
  .tool-list li{border-top: 1px solid #f0f0f0; font-size: 0.875em; line-height: 150%;}
  .tool-list li .fn-flex{justify-content: space-between; padding: 0.875em 0.625em;}
  .tool-list li i{font-size: 0.625em; color: #9e9e9e;}

  @media screen and (max-width: 480px) {

  }
</style>
