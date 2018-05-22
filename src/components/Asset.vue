<template>
  <div>
    <tab v-bind:titles="[{text: '资产列表', key: 'list'}, {text: '查询资产', key: 'find'}, {text: '添加资产', key: 'add'}]" defaultKey="list">
      <div slot="list">1</div>
      <div slot="find">
        <p>查询</p>
        <p><label>域名</label><input type="text" v-model="searchDomain"/></p>
        <p><button v-on:click="searchAsset">搜索</button></p>
        <hr />
        <div><label>资产名称</label><label>icon</label><label>资产编码</label><label>资产信息</label></div>
        <div v-for="(item,index) in searchResults" :key="index">
          <span>{{ item.name }}</span>
          <span>{{ item.image }}</span>
          <span>{{ item.code }}</span>
          <span><button v-on:click="showInfo(item)">详细信息</button></span>
          <span><button v-on:click="saveAsset(item)">保存资产</button></span>
        </div>
      </div>
      <div slot="add">3</div>
    </tab>

    <modals-container/>

  </div>
</template>

<script>
import Tab from './widget/Tab'
import StellarSdk from 'stellar-sdk'
import Vue from 'vue'
import sdk from '../libs/sdk'

export default {
  name: 'Asset',
  components: {
    Tab
  },
  data: function () {
    return {
      searchDomain: '',
      searchResults: [],
      selectData: null
    }
  },
  methods: {
    saveAsset: function (item) {
      var wallet = this.$store.getters.getActiveWallet

      if (!wallet) {
        return false
      }
      try {
        var asset = new StellarSdk.Asset(item.code, item.issuer)
        var changeTrust = {'asset': asset}
        var server = sdk.getServer()
        server.loadAccount(wallet.publicKey).then((data) => {
          var trust = new StellarSdk.TransactionBuilder(data)
            .addOperation(StellarSdk.Operation.changeTrust(changeTrust))
            .build()
          trust.sign(StellarSdk.Keypair.fromSecret(wallet.secretKey))
          server.submitTransaction(trust)
            .then((res) => {
              console.log(res)
            })
        }).catch((res) => {
          console.log(res)
        })
      } catch (e) {
        Vue.toast('失败了.' + JSON.stringify(e))
        return false
      }
    },
    showInfo: function (item) {
      this.$modal.show({
        template: `
          <div>
            <h1>This is created inline</h1>
            <p>资产名称： {{ item.name }}</p>
            <p>资产图片： <img :src="item.image" /></p>
            <p>资产发行账号： {{ item.issuer }}</p>
            <p>资产描述: {{ item.desc }}</p>
            <p>资产条件: {{ item.conditions }}</p>
            <button @click="$emit('close')">Close</button>
          </div>
        `,
        props: ['item']
      }, {
        item: item
      }, {
        height: 'auto'
      }, {
        'before-close': (event) => { console.log('this will be called before the modal closes') }
      })
    },
    searchAsset: function () {
      StellarSdk.StellarTomlResolver.resolve(this.searchDomain)
        .then((res) => {
          this.searchResults = res.CURRENCIES
        })
        .catch(() => {
          Vue.toast('没有找到任何资产信息')
        })
    }
  }
}
</script>

<style scoped>

</style>
