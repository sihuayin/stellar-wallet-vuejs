import Vue from 'vue'
import Router from 'vue-router'
import Unlock from '@/components/Unlock'
import Wallet from '@/components/Wallet'
import Splash from '@/components/Splash'
import Setup from '@/components/Setup'
import TransactionHistory from '@/components/TransactionHistory'
import WalletList from '@/components/WalletList'
import { install as Mint } from 'mint-ui/lib/index'
import storage from '../libs/storage'
import 'mint-ui/lib/style.css'
import sdk from '../libs/sdk'

Vue.use(Router)
Vue.use(Mint)
sdk.init()

function requireAuth (route, redirect, next) {
  var wallets = storage.getAllWallets()
  if (!wallets || wallets.length < 1) {
    next('/unlock')
  } else {
    next()
  }
}

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Spalsh',
      component: Splash
    },
    {
      path: '/unlock',
      name: 'Unlock',
      component: Unlock
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: Wallet,
      beforeEnter: requireAuth
    },
    {
      path: '/wallet_list',
      name: 'WalletList',
      component: WalletList,
      beforeEnter: requireAuth
    },
    {
      path: '/setup',
      name: 'Setup',
      component: Setup,
      beforeEnter: requireAuth
    },
    {
      path: '/history',
      name: 'History',
      component: TransactionHistory,
      beforeEnter: requireAuth
    }
  ]
})

export default router
