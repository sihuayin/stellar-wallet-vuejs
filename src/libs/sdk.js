import StellarSdk from 'stellar-sdk'
import request from 'superagent'
var server

const ADDRESS = 'https://horizon.stellar.org'
// const TEST_ADDRESS = 'http://stellar1.popchain.co:8000' // 'https://horizon-testnet.stellar.org' // http://47.75.60.214:8000
// const DADDY_ADDRESS = 'http://stellar1.popchain.co:8004' // 'https://friendbot.stellar.org' // http://47.75.60.214:8004

const TEST_ADDRESS = 'https://horizon-testnet.stellar.org' // http://47.75.60.214:8000
const DADDY_ADDRESS = 'https://friendbot.stellar.org' // http://47.75.60.214:8004

export default {
  init: function () {
    if (process.env.NODE_ENV === 'production') {
      server = new StellarSdk.Server(ADDRESS)
      StellarSdk.Network.usePublicNetwork()
    } else {
      StellarSdk.Config.setAllowHttp(true)
      StellarSdk.Network.useTestNetwork()
      server = new StellarSdk.Server(TEST_ADDRESS)
    }
  },

  getServer: function () {
    return server
  },
  isTest: function () {
    return process.env.NODE_ENV !== 'production'
  },
  whoIsYourDaddy: function (publicKey) {
    return request.get(DADDY_ADDRESS).query({ addr: publicKey })
  }
}
