import { BN, web3 } from '@project-serum/anchor'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import moment from 'moment'
import React from 'react'

import { IDO_ENDPOINTS } from '../../config/constants'
import PoolCard from './PoolCard'

const fix = 10
const unixTs = moment().unix()
const startIdo = moment.unix(unixTs).add(fix, 'seconds')
const endDeposits = moment.unix(unixTs).add(fix, 'seconds')
const endIdo = moment.unix(unixTs).add(fix, 'seconds')
const startRedeem = moment.unix(unixTs).add(fix, 'seconds')

const idoConfig = IDO_ENDPOINTS.find((i) => i.network === 'devnet')

const poolMock = {
  distributionAuthority: new web3.PublicKey(0),
  endDepositsTs: new BN(endDeposits.unix()),
  endIdoTs: new BN(endIdo.unix()),
  nonce: 254,
  numIdoTokens: new BN(2),
  poolUsdc: new web3.PublicKey(idoConfig.usdcMint),
  poolWatermelon: new web3.PublicKey(idoConfig.usdcMint),
  publicKey: new web3.PublicKey(idoConfig.pools[0]),
  redeemableMint: new web3.PublicKey(idoConfig.usdcMint),
  startIdoTs: new BN(startIdo.unix()),
  watermelonMint: new web3.PublicKey(idoConfig.usdcMint),
  withdrawMelonTs: new BN(startRedeem.unix()),
}

const Template: ComponentStory<typeof PoolCard> = (args) => (
  <PoolCard {...args} />
)

export default {
  title: 'Example/PoolCard',
  component: PoolCard,
  // argTypes: {
  //   pool: { control: 'object' },
  //   round: { control: 'string' },
  // },
} as ComponentMeta<typeof PoolCard>

// Stories

export const PoolNotStarted = Template.bind({})
PoolNotStarted.args = {
  pool: poolMock,
  round: '1',
}
