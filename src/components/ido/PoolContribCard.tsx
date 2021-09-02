import React, { useCallback, useEffect, useState } from 'react'
import 'twin.macro'
import useInterval from '../../hooks/useInterval'
import useIpAddress from '../../hooks/useIpAddress'
import useLargestAccounts from '../../hooks/useLargestAccounts'
import usePool from '../../hooks/usePool'
import { notify } from '../../stores/useNotificationStore'
import useWalletStore, { PoolAccount } from '../../stores/useWalletStore'
import { Button } from '../button'
import { AmountInput } from '../input/AmountInput'
import Loading from '../Loading'
import { ButtonMenu, ButtonMenuItem } from '../menu'

interface PoolContribCardProps {
  pool: PoolAccount
}

const PoolContribCard: React.FC<PoolContribCardProps> = ({ pool }) => {
  const actions = useWalletStore((s) => s.actions)
  const connected = useWalletStore((s) => s.connected)
  const largestAccounts = useLargestAccounts(pool)
  // const vaults = useVaults()
  const { startIdo, endIdo, endDeposits } = usePool(pool)
  const { ipAllowed } = useIpAddress()

  const usdcBalance = largestAccounts.usdc?.balance || 0
  const redeemableBalance = largestAccounts.redeemable?.balance || 0

  const [isDeposit, setIsDeposit] = useState(true)

  const totalBalance = isDeposit ? usdcBalance : redeemableBalance
  console.log('totalBalance', totalBalance.toString())

  // refresh usdc vault regularly
  useInterval(async () => {
    if (endIdo.isAfter()) {
      await actions.fetchUsdcVault(pool)
    } else {
      await actions.fetchPrtVault(pool)
      await actions.fetchRedeemableMint(pool)
    }
  }, 10_000)

  // const mangoRedeemable = vaults.usdc
  //   ? (redeemableBalance * vaults.mango.balance) / vaults.usdc.balance
  //   : 0

  const [inputAmount, setInputAmount] = useState('0')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [maxButtonTransition, setMaxButtonTransition] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    console.log('reset input on balance change')
    setInputAmount('')
    if (redeemableBalance > 0) {
      setSubmitted(true)
    }
  }, [totalBalance])

  useEffect(() => {
    setSubmitted(false)
  }, [connected])

  const handleSubmitContribution = useCallback(() => {
    setSubmitting(true)
  }, [])

  const handleChangeMode = useCallback(
    (value: number) => {
      setIsDeposit(value === 0)
    },
    [setIsDeposit]
  )

  const onChangeAmountInput = (amount: string) => {
    setInputAmount(amount)
    if (endDeposits?.isBefore() && +amount > redeemableBalance) {
      setErrorMessage('Deposits ended, contribution cannot increase')
      setTimeout(() => setErrorMessage(null), 4000)
    } else {
      // setWalletAmount(totalBalance - amount);
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await actions.fetchWalletTokenAccounts()
    } finally {
      setTimeout(() => setRefreshing(false), 1000)
    }
  }

  useEffect(() => {
    if (maxButtonTransition) {
      setMaxButtonTransition(false)
    }
  }, [maxButtonTransition])

  useEffect(() => {
    setLoading(true)
    if (largestAccounts.usdc) {
      setLoading(false)
    }
  }, [largestAccounts])

  useEffect(() => {
    if (submitting) {
      const handleSubmit = async () => {
        try {
          if (isDeposit) {
            await actions.submitDepositContribution(pool, +inputAmount)
          } else {
            await actions.submitWithdrawContribution(pool, +inputAmount)
          }
          setSubmitted(true)
          setSubmitting(false)
        } catch (e) {
          notify({
            type: 'error',
            title: isDeposit ? 'Deposit error' : 'Withdraw error',
            message: e.message,
          })
          setSubmitted(false)
          setSubmitting(false)
        }
      }
      handleSubmit()
    }
  }, [submitting, isDeposit])

  const canDeposit =
    connected &&
    !submitting &&
    startIdo.isBefore() &&
    endIdo.isAfter() &&
    endDeposits.isAfter()

  useEffect(() => {
    if (!canDeposit) {
      handleChangeMode(1)
    }
  }, [canDeposit])

  const canWithdraw =
    connected && !submitting && startIdo.isBefore() && endIdo.isAfter()

  const disableSubmit = loading || isDeposit ? !canDeposit : !canWithdraw // difference == 0 ;

  return (
    <>
      <div className="my-2">
        <ButtonMenu
          activeIndex={isDeposit ? 0 : 1}
          onItemClick={handleChangeMode}
        >
          <ButtonMenuItem disabled={!canDeposit}>Deposit</ButtonMenuItem>
          <ButtonMenuItem>Withdraw</ButtonMenuItem>
        </ButtonMenu>
      </div>
      <div className="pb-4 text-center">
        {!submitted && submitting && (
          <>
            <h2>Approve the transaction.</h2>
            <p>Almost there...</p>
          </>
        )}
        {submitting && (
          <div className="flex h-64 items-center justify-center">
            <Loading className="h-6 w-6 mb-3 text-primary-light" />
          </div>
        )}
      </div>
      <AmountInput
        title={isDeposit ? 'I want to deposit' : 'Withdraw collateral'}
        placeholder="0"
        maxValue={totalBalance.toString()}
        maxIsLoading={refreshing}
        maxLabel={isDeposit ? `balance:` : `max withdraw:`}
        // hasError={collateralInputError.hasError}
        // errorMessage={collateralInputError.message}
        tokenSymbol="USDC"
        tokenIcon="usdc.svg"
        value={inputAmount}
        valueRound="ceil"
        decimals={6}
        onChange={onChangeAmountInput}
        disabled={!connected}
      />
      {ipAllowed || !connected ? (
        <Button
          onClick={handleSubmitContribution}
          className="w-full my-4"
          disabled={disableSubmit}
        >
          <div className={`flex items-center justify-center`}>
            {isDeposit ? `Deposit` : `Withdraw`}
          </div>
        </Button>
      ) : (
        <Button className="w-full my-4" disabled>
          <div className={`flex items-center justify-center`}>
            Country Not Allowed 🇺🇸😭
          </div>
        </Button>
      )}
      <p>
        {endDeposits?.isBefore() && endIdo?.isAfter()
          ? 'You can only reduce your contribution during the grace period. Reducing cannot be reversed.'
          : 'Increase or reduce your contribution.'}
      </p>
    </>
  )
}

export default PoolContribCard
