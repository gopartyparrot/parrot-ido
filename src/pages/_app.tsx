import '../components/toast/toast.scss'
import '../components/tooltip/tooltip.scss'
import '../styles/global.scss'

import { WalletProvider } from '@parrotfi/wallets'
import BigNumber from 'bignumber.js'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import React from 'react'

import Notifications from '../components/Notifications'
import { DEFAULT_RPC, RPC_ENDPOINTS } from '../config/constants'
import { IDOProvider } from '../contexts/IDOContext'
import { ModalProvider } from '../contexts/ModalContext'
import { RefreshProvider } from '../contexts/RefreshContext'
import { notify } from '../stores/useNotificationStore'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function App({ Component, pageProps }) {
  const title = 'Parrot Protocol IDO'
  const description =
    'This is the IDO (initial DEX offering) page for Parrot Protocol, a liquidity network for borrowing and lending on Solana. Get access to PRT tokens!'
  const keywords = 'Parrot, IDO, DeFi, Solana, Lending, Borrow'
  const baseUrl = 'https://ido.parrot.fi'

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${baseUrl}/images/og.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@gopartyparrot" />
      </Head>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <WalletProvider
          endpoints={RPC_ENDPOINTS}
          defaultEndpoint={DEFAULT_RPC}
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
