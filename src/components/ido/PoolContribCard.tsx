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
import { ButtonMenu, ButtonMenuItem } from '../menu'

interface PoolContribCardProps {
  pool: PoolAccount
}

const PoolContribCard: React.FC<PoolContribCardProps> = ({ pool }) => {
  const actions = useWalletStore((s) => s.actions)
  const connected = useWalletStore((s) => s.connected)
  const largestAccounts = useLargestAccounts(pool)
  const { startIdo, endIdo, endDeposits } = usePool(pool)
  const { ipAllowed } = useIpAddress()

  const usdcBalance = largestAccounts.usdc?.balance || 0
  const redeemableBalance = largestAccounts.redeemable?.balance || 0

  const [isDeposit, setIsDeposit] = useState(true)

  const totalBalance = isDeposit ? usdcBalance : redeemableBalance

  const [inputAmount, setInputAmount] = useState('0')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [maxButtonTransition, setMaxButtonTransition] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    console.log('reset input on balance change')
    setInputAmount('')
  }, [totalBalance])

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
          setSubmitting(false)
        } catch (e) {
          notify({
            type: 'error',
            title: isDeposit ? 'Deposit error' : 'Withdraw error',
            message: e.message,
          })
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

  const disableSubmit =
    !connected || loading || submitting || isDeposit
      ? !canDeposit
      : !canWithdraw

  return (
    <>
      <ButtonMenu
        activeIndex={isDeposit ? 0 : 1}
        onItemClick={handleChangeMode}
      >
        <ButtonMenuItem disabled={!canDeposit}>Deposit</ButtonMenuItem>
        <ButtonMenuItem>Withdraw</ButtonMenuItem>
      </ButtonMenu>
      <div className="mt-4" />
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

      <Button
        onClick={handleSubmitContribution}
        className="w-full my-4"
        disabled={disableSubmit}
        isLoading={submitting}
      >
        {submitting ? 'Waiting approval' : isDeposit ? `Deposit` : `Withdraw`}
      </Button>
      {/* <Button className="w-full my-4" disabled>
          Country Not Allowed 🇺🇸😭
        </Button> */}
      <p className="text-xs">
        {endDeposits?.isBefore() && endIdo?.isAfter()
          ? 'You can only reduce your contribution during the grace period. Reducing cannot be reversed.'
          : 'Increase or reduce your contribution.'}
      </p>
    </>
  )
}

export default PoolContribCard
