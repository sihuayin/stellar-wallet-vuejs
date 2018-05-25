<template>
  <div class="container">
    <Head />
    <div class="content">
      <h2 class="column-title">资产</h2>
      <Tabs>
        <Tab title="资产列表" index="0" class="assets-tab-con">
          <div v-for="(item,index) in assets" :key="index" class="assets-list">
            <div v-if="item.asset_type === 'native'" class="fn-flex assets-list-item">
              <div class="left"><img src="../assets/images/bit.jpg"/></div>
              <div class="middle">
                <p class="code"><span>代码：</span>Lumen</p>
                <p><span>余额：</span>{{ balance }} XLM</p>
              </div>
              <div class="right"></div>
            </div>
            <div v-else class="fn-flex assets-list-item">
              <div class="left"><img src="../assets/images/bit.jpg"/></div>
              <div class="middle">
                <p class="code"><span>代码：</span>{{ item.asset_issuer }}</p>
                <p><span>余额：</span>{{ item.balance }} {{ item.asset_code }}</p>
              </div>
              <div class="right">
                <button type="button" class="ui-btn ui-btn-white ui-btn-s" v-on:click="showInfo(item)">详情</button>
                <button type="button" class="ui-btn ui-btn-s" v-on:click="addForAsset(item)">要资产</button>
              </div>
            </div>
          </div>
        </Tab>

        <Tab title="查询资产" index="1" class="assets-tab-con">
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
        </Tab>

        <Tab index="2" title="添加资产" class="assets-tab-con">
          <div>
            <label>资产编码</label> <input type="text" v-model="code" /><br />
            <label>资产发行账号</label> <input type="text" v-model="issuer" /> <br />
            <label>额度</label><input type="text" v-model="limit"/>
            <p>解释一番</p>
            <button v-on:click="doChange">确定</button>
          </div>
        </Tab>
      </Tabs>
    </div>

    <modals-container/>

  </div>
</template>

<script>
import Head from './Head'
import Tab from './widget/Tab'
import Tabs from './widget/Tabs'
import StellarSdk from 'stellar-sdk'
import Vue from 'vue'
import sdk from '../libs/sdk'
import * as func from '../libs/func'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Asset',
  components: {
    Head,
    Tabs,
    Tab
  },
  computed: mapGetters({
    wallet: 'getActiveWallet'
  }),
  data: function () {
    return {
      searchDomain: '',
      searchResults: [],
      selectData: null,
      assets: [],
      balance: 0,
      issuer: '',
      code: '',
      limit: 0
    }
  },
  created: function () {
    // 读取当前钱包的数据，查询出对应的资产
    var server = sdk.getServer()
    server.loadAccount(this.wallet.publicKey).then((data) => {
      this.assets = data.balances
      for (var i = 0; i < data.balances.length; i++) {
        if (data.balances[i].asset_type === 'native') {
          this.balance = data.balances[i].balance
        }
      }
      // todo 显示详细信息，需要请求数据
    })
  },
  methods: {
    ...mapActions([
      'loadAccound'
    ]),
    addForAsset: function (item) {
      var server = sdk.getServer()
      var issuingKeys = StellarSdk.Keypair.fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4')
      var astroDollar = new StellarSdk.Asset(item.asset_code, item.asset_issuer)
      //
      var wallet = this.$store.getters.getActiveWallet
      server.loadAccount(wallet.publicKey).then((receiver) => {
        var trusted = receiver.balances.some(function (balance) {
          return balance.asset_code === item.asset_code && balance.asset_issuer === item.asset_issuer
        })
        console.log(trusted)
        if (!trusted) {
          console.log('不信任就无法转账')
          return false
        }
        server.loadAccount(issuingKeys.publicKey()).then((issuer) => {
          var transaction = new StellarSdk.TransactionBuilder(issuer)
            .addOperation(StellarSdk.Operation.payment({
              destination: wallet.publicKey,
              asset: astroDollar,
              amount: '10'
            }))
            .build()
          transaction.sign(issuingKeys)
          return server.submitTransaction(transaction)
        }).then((res) => {
          console.log(res)
        }).catch((res) => {
          console.log(res)
        })
      })
    },
    doChange: function () {
      this.doIt(this.code, this.issuer, this.limit)
    },
    saveAsset: function (item) {
      this.doIt(item.code, item.issuer, 0)
    },
    doIt: function (code, issuer, limit) {
      var wallet = this.$store.getters.getActiveWallet

      if (!wallet) {
        return false
      }
      try {
        var asset = new StellarSdk.Asset(code, issuer)
        var changeTrust = limit ? {'asset': asset, 'limit': limit} : {'asset': asset}
        var server = sdk.getServer()
        server.loadAccount(wallet.publicKey).then((data) => {
          var trust = new StellarSdk.TransactionBuilder(data)
            .addOperation(StellarSdk.Operation.changeTrust(changeTrust))
            .build()
          trust.sign(StellarSdk.Keypair.fromSecret(func.decodeSecretKey(wallet.secretKey)))
          server.submitTransaction(trust)
            .then((res) => {
              console.log(res)
            })
        }).catch((res) => {
          Vue.toast('更新成功')
          this.loadAccound()
        })
      } catch (e) {
        Vue.toast('失败了.' + JSON.stringify(e))
        return false
      }
    },
    showInfo: function (item) {
      this.$modal.show({
        template: `
          <div class="modal">
            <div class="modal-top fn-flex">
              <h2 class="modal-title">资产详情</h2>
              <div @click="$emit('close')" class="modal-close"><i class="iconfont icon-X"></i></div>
            </div>
            <div class="modal-del">
              <!--item.image-->
              <div class="modal-del-title fn-flex"><img src="/static/img/bit.de429d5.jpg" /><span>{{ item.name }}</span></div>
              <ul class="modal-del-list">
                <li class="fn-break"><span>资产发行账号：</span>{{ item.issuer }}</li>
                <li><span>资产描述：</span>{{ item.desc }}</li>
                <li><span>资产条件：</span>{{ item.conditions }}</li>
              </ul>
            </div>
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
  .content{box-sizing: border-box; max-width: 60em; min-height: 36em; margin: 0 auto; padding: 1.5em 1em; background-color: #fff;}
  .column-title{margin-bottom: 1em; padding: 0.5em 0; font-size: 1.125em;}
  .assets-list-item{padding: 1em 0; border-bottom: 1px solid #e5e5e5;}
  .assets-list-item .left{width: 10%; text-align: center;}
  .assets-list-item .left img{width: 70%; max-width: 2.5em;}
  .assets-list-item .middle{width: 70%; box-sizing: border-box; padding: 0 0.5em; font-size: 0.875em;}
  .assets-list-item .middle p{line-height: 180%;}
  .assets-list-item .middle .code{width: 100%; overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;}
  .assets-list-item .middle span{color: #666;}
  .assets-list-item .right{width: 20%; text-align: center;}
  .assets-list-item .right button{padding-left: 0; padding-right: 0; margin: 0.3em; width: 5.6em;}

  @media screen and (max-width: 480px) {
    .content{padding: 1em 0 0; min-height: auto;}
    .column-title{margin-bottom: 0.5em; padding: 0.5em 0.625em;}
    .assets-list-item{padding: 0.75em 0;}
    .assets-list-item .right .ui-btn-s{padding-top: 0.35em; padding-bottom: 0.35em; width: 5em;}
  }
</style>
