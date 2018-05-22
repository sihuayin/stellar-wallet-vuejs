<template>
  <div>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange">
      <div class="no-data" v-if="isLoading">
        <i>loading....</i>
      </div>
      <div class="" v-else>
        <div v-if="list.length < 1" class="no-data">
          暂无交易记录
        </div>
        <div class="list" v-else>
          <div v-for="(item, index) in list" :key="index">
            <TransactionItem v-bind:item="item" v-bind:transaction_id="item._links.transaction.href | cultHref"/>
          </div>
        </div>
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        </div>
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
        that.isLoading = false
        that.list = ops.records
      })
      .catch(function () {
        that.isLoading = false
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
      isLoading: true,
      list: [],
      topStatus: 'loading'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .no-data{padding: 3em 0; text-align: center; color: #9e9e9e; font-size: 0.875em;}
  .list{}
  @media screen and (max-width: 480px) {

  }
</style>
