<template>
  <div>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange">
      <div v-if="list.length < 1" class="no-data">
        暂无交易记录
      </div>
      <ul v-else>
        <li v-for="(item, index) in list" :key="index">
          <TransactionItem v-bind:item="item" v-bind:transaction_id="item._links.transaction.href | cultHref"/>
        </li>
      </ul>
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
