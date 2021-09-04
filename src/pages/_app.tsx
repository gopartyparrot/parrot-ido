import { WalletProvider } from '@parrotfi/wallets'
import BigNumber from 'bignumber.js'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import React from 'react'
import Notifications from '../components/Notifications'
import { RPC_ENDPOINT, RPC_ENDPOINTS } from '../config/constants'
import { IDOProvider } from '../contexts/IDOContext'
import { ModalProvider } from '../contexts/ModalContext'
import { RefreshProvider } from '../contexts/RefreshContext'
import { notify } from '../stores/useNotificationStore'
import '../styles/global.scss'
import '../components/toast/toast.scss'
import '../components/tooltip/tooltip.scss'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function App({ Component, pageProps }) {
  const title = 'Parrot IDO'
  const description =
    'Claim your stake in the Mango DAO. Join us in building Mango, the protocol for permissionless leverage trading & lending.'
  const keywords =
    'Parrot IDO, Serum, SRM, Serum DEX, DEFI, Decentralized Finance, Decentralised Finance, Crypto, ERC20, Ethereum, Decentralize, Solana, SOL, SPL, Cross-Chain, Trading, Fastest, Fast, SerumBTC, SerumUSD, SRM Tokens, SPL Tokens'
  const baseUrl = 'https://ido.parrot.fi'

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${baseUrl}/preview.jpg`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@mangomarkets" />
      </Head>
      <ThemeProvider defaultTheme="light" attribute="class">
        <WalletProvider
          endpoints={RPC_ENDPOINTS}
          defaultEndpoint={RPC_ENDPOINT}
          onNotify={notify}
        >
          <ModalProvider>
            <IDOProvider>
              <RefreshProvider>
                <Component {...pageProps} />
              </RefreshProvider>
              <Notifications />
              <div id="tooltip-portal-root" />
            </IDOProvider>
          </ModalProvider>
        </WalletProvider>
      </ThemeProvider>
    </>
  )
}

export default App
