<template>
  <div>
    <ul>
      <li>123123</li>
    </ul>

    <mt-button type="primary" v-on:click="showPanel">添加</mt-button>
    <mt-popup
      v-model="showAddPanel"
      modal="true"
      position="top">
        <div>
          <mt-field label="钱包名称" placeholder="请输入名称" v-model="walletName"></mt-field>
          <mt-field label="密钥" placeholder="请输入密钥" v-model="secretKey"></mt-field>
          <mt-button type="primary" v-on:click="finish">完成</mt-button>
        </div>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: 'LeftSide',
  created: function () {
  },
  methods: {
    showPanel: function () {
      this.showAddPanel = true
    },
    finish: function () {
      this.showAddPanel = false
      this.walletName = ''
      this.secretKey = ''
    }
  },
  data () {
    return {
      showAddPanel: false,
      walletName: '',
      secretKey: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
