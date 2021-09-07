import '../components/toast/toast.scss'
import '../components/tooltip/tooltip.scss'
import '../styles/global.scss'

import { BN, web3 } from '@project-serum/anchor'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import moment from 'moment'
import React, { useEffect } from 'react'

import PoolCard from '../components/ido/PoolCard'
import { IDO_ENDPOINTS } from '../config/constants'
import useWalletStore from '../stores/useWalletStore'

const idoConfig = IDO_ENDPOINTS.find((i) => i.network === 'devnet')

const getMockPool = (
  status: 'starting' | 'started' | 'endDeposit' | 'ended' | 'startRedeem'
) => {
  const startIdo = moment().add(status === 'starting' ? 1 : 0, 'hours')
  const endDeposits = moment().add(
    /ended|endDeposit|startRedeem/.test(status) ? 0 : 1,
    'hours'
  )
  const endIdo = moment().add(/ended|startRedeem/.test(status) ? 0 : 1, 'hours')
  const startRedeem = moment().add(status === 'startRedeem' ? 0 : 3, 'hours')
  return {
    nonce: 254,
    numIdoTokens: new BN(2),
    publicKey: new web3.PublicKey(idoConfig.pools[0]),
    poolUsdc: new web3.PublicKey(idoConfig.usdcMint),
    poolWatermelon: new web3.PublicKey(idoConfig.usdcMint),
    redeemableMint: new web3.PublicKey(idoConfig.usdcMint),
    watermelonMint: new web3.PublicKey(idoConfig.usdcMint),
    distributionAuthority: new web3.PublicKey(0),
    // times
    startIdoTs: new BN(startIdo.unix()),
    endDepositsTs: new BN(endDeposits.unix()),
    endIdoTs: new BN(endIdo.unix()),
    withdrawMelonTs: new BN(startRedeem.unix()),
  }
}

const Template: ComponentStory<typeof PoolCard> = (args) => {
  const { connected, status } = args as any
  const { set } = useWalletStore()
  useEffect(() => {
    set((s) => {
      s.connected = connected === 'Connected'
    })
  }, [connected])
  const pool = getMockPool(status)
  return <PoolCard {...args} pool={pool} />
}

export default {
  title: 'IDO Pool Card',
  parameters: {
    docs: {
      description: {
        component: 'Pool card representing all states of a IDO pool',
      },
    },
  },
  component: PoolCard,
  argTypes: {
    connected: {
      options: ['Connected', 'Disconnected'],
      control: { type: 'radio' },
    },
    status: {
      options: ['starting', 'started', 'endDeposit', 'ended', 'startRedeem'],
      control: { type: 'select' },
    },
    round: { control: 'string' },
  },
} as ComponentMeta<typeof PoolCard>

// Stories

export const IDO_Starting = Template.bind({})
IDO_Starting.args = {
  status: 'starting',
  round: '1',
}

export const IDO_Started = Template.bind({})
IDO_Started.args = {
  status: 'started',
  round: '1',
}

export const IDO_Deposits_Ended = Template.bind({})
IDO_Deposits_Ended.args = {
  status: 'endDeposit',
  round: '1',
}

export const IDO_Ended = Template.bind({})
IDO_Ended.args = {
  status: 'ended',
  round: '1',
}

export const IDO_Redeems_Starts = Template.bind({})
IDO_Redeems_Starts.args = {
  status: 'startRedeem',
  round: '1',
}
