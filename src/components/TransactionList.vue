<template>
  <div>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange">
      <div v-if="list.length < 1" class="no-data">
        暂无交易记录
      </div>
      <div class="" v-else>
        <table>
          <thead>
          <tr>
            <th width="10%">时间</th>
            <th width="10%">收支类型</th>
            <th width="40%">地址</th>
            <th width="10%">金额</th>
            <th>说明</th>
          </tr>
          </thead>
          <tbody v-for="(item, index) in list" :key="index">
          <TransactionItem v-bind:item="item" v-bind:transaction_id="item._links.transaction.href | cultHref"/>
          </tbody>
        </table>
      </div>
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        <span v-show="topStatus === 'loading'">Loading...</span>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
import sdk from '../libs/sdk'
import TransactionItem from './TransactionItem'

export default {
  name: 'TransactionList',
  components: {
    TransactionItem
  },
  props: ['publicKey'],
  created: function () {
    var that = this
    var server = sdk.getServer()
    console.log(this.publicKey)
    server.operations()
      .forAccount(this.publicKey)
      .limit(25)
      .order('desc')
      .call()
      .then(function (ops) {
        that.list = ops.records
      })
      .catch(function () {
        that.list = []
      })
  },

  methods: {
    loadTop: function () {
      console.log('Top ...')
    },

    handleTopChange: function () {
      console.log('change ...')
    }
  },
  filters: {
    cultHref: function (value) {
      return value.split('/')[4]
    }
  },
  data () {
    return {
      list: [],
      topStatus: 'loading'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .no-data{padding: 3em 0; text-align: center; color: #9e9e9e; font-size: 0.875em;}
</style>
