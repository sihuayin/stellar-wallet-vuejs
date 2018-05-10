import StellarSdk from 'stellar-sdk'

var server

export default {
  init: function () {
    if (process.env.NODE_ENV === 'production') {
      server = new StellarSdk.Server('https://horizon.stellar.org')
      StellarSdk.Network.usePublicNetwork()
    } else {
      // server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
      // StellarSdk.Network.useTestNetwork()

      StellarSdk.Config.setAllowHttp(true)
      StellarSdk.Network.useTestNetwork()
      server = new StellarSdk.Server('http://47.75.60.214:8000')
    }
  },

  getServer: function () {
    return server
  }
}
