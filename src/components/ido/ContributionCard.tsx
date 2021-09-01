import React, { useEffect, useState } from 'react';
import {
  ExclamationCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  RefreshIcon
} from '@heroicons/react/outline';
import useWalletStore from '../../stores/useWalletStore';
import Input from '../Input';
import { Button } from '../Button';
// import ConnectWalletButton from '../ConnectWalletButton';
// import PoolCountdown from './PoolCountdown'
import Slider from '../Slider';
import Loading from '../Loading';
import useLargestAccounts from '../../hooks/useLargestAccounts';
import usePool from '../../hooks/usePool';
import styled from '@emotion/styled';
import 'twin.macro';
import { notify } from '../../utils/notifications';
import useIpAddress from '../../hooks/useIpAddress';
import { AmountInput } from '../input/AmountInput';
import StatsCard from './StatsCard';

const SmallButton = styled.button``;

interface ContributionCardProps {
  round?: string;
}

const ContributionCard: React.FC<ContributionCardProps> = ({ round }) => {
  const actions = useWalletStore(s => s.actions);
  const connected = useWalletStore(s => s.connected);
  const largestAccounts = useLargestAccounts();
  // const vaults = useVaults()
  const { endIdo, endDeposits } = usePool();
  const { ipAllowed } = useIpAddress();

  const usdcBalance = largestAccounts.usdc?.balance || 0;
  const redeemableBalance = largestAccounts.redeemable?.balance || 0;

  const isDeposit = true;

  const totalBalance = isDeposit ? usdcBalance : redeemableBalance;
  console.log('totalBalance', totalBalance.toString());

  // const mangoRedeemable = vaults.usdc
  //   ? (redeemableBalance * vaults.mango.balance) / vaults.usdc.balance
  //   : 0

  const [inputAmount, setInputAmount] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editContribution, setEditContribution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [maxButtonTransition, setMaxButtonTransition] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const usdFormat = new Intl.NumberFormat('en-US');

  //const priceFormat = new Intl.NumberFormat('en-US', {
  //  maximumSignificantDigits: 4,
  //})

  useEffect(() => {
    console.log('refresh modal on balance change');
    // setInputAmount(redeemableBalance);
    // if (redeemableBalance > 0) {
    //   setSubmitted(true);
    // }
  }, [totalBalance]);

  useEffect(() => {
    setSubmitted(false);
    setEditContribution(false);
  }, [connected]);

  const handleSetContribution = () => {
    setSubmitting(true);
    setEditContribution(false);
  };

  const handleEditContribution = () => {
    setEditContribution(true);
    setSubmitted(false);
  };

  const onChangeAmountInput = (amount: string) => {
    setInputAmount(amount);
    if (endDeposits?.isBefore() && +amount > redeemableBalance) {
      setErrorMessage('Deposits ended, contribution cannot increase');
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      // setWalletAmount(totalBalance - amount);
    }
  };

  // const onChangeSlider = percentage => {
  //   let newContribution = Math.round(percentage * totalBalance) / 100;
  //   if (endDeposits?.isBefore() && newContribution > redeemableBalance) {
  //     newContribution = redeemableBalance;
  //     setErrorMessage('Deposits ended, contribution cannot increase');
  //     setTimeout(() => setErrorMessage(null), 4000);
  //   }

  //   setWalletAmount(totalBalance - newContribution);
  //   setInputAmount(newContribution);
  // };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await actions.fetchWalletTokenAccounts();
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  useEffect(() => {
    if (maxButtonTransition) {
      setMaxButtonTransition(false);
    }
  }, [maxButtonTransition]);

  useEffect(() => {
    setLoading(true);
    if (largestAccounts.usdc) {
      setLoading(false);
    }
  }, [largestAccounts]);

  useEffect(() => {
    if (submitting) {
      const handleSubmit = async () => {
        try {
          await actions.submitContribution(inputAmount);
          setSubmitted(true);
          setSubmitting(false);
        } catch (e) {
          notify({ type: 'error', message: e.message });
          console.error(e.message);
          setSubmitted(false);
          setSubmitting(false);
        }
      };
      handleSubmit();
    }
  }, [submitting]);

  const hasUSDC = usdcBalance > 0 || redeemableBalance > 0;
  // const difference = inputAmount - redeemableBalance;

  const toLateToDeposit =
    endDeposits?.isBefore() &&
    endIdo.isAfter() &&
    !largestAccounts.redeemable?.balance;

  const disableFormInputs =
    submitted || !connected || loading || (connected && toLateToDeposit);

  const dontAddMore = endDeposits?.isBefore(); // && inputAmount > redeemableBalance;
  const disableSubmit = disableFormInputs || dontAddMore; // difference == 0 ;

  console.log(
    'toLateToDeposit',
    connected,
    toLateToDeposit,
    disableFormInputs,
    dontAddMore
  );

  const allEnded =
    !submitted &&
    !submitting &&
    !editContribution &&
    connected &&
    toLateToDeposit;

  const canDeposit =
    connected &&
    !submitted &&
    !submitting &&
    !editContribution &&
    !toLateToDeposit;

  return (
    <div className="bg-white rounded-3xl min-w-card">
      <header className="md:border-b-2 border-brandPrimary px-6 pt-6 pb-3">
        <h1 className="text-md font-bold">IDO Round 1</h1>
      </header>
      <div className="px-6 py-4">
        <div className="pb-4 text-center">
          {!submitted && submitting && (
            <>
              <h2>Approve the transaction.</h2>
              <p>Almost there...</p>
            </>
          )}

          {submitted && !submitting && (
            <>
              <h2>You&apos;ve contributed ${inputAmount}.</h2>
              <p>Unlock to edit your contribution amount.</p>
            </>
          )}

          {editContribution && !submitting && (
            <>
              <h2>
                You&apos;ve contributed ${usdFormat.format(redeemableBalance)}.
              </h2>
              <p>
                {endDeposits?.isBefore() && endIdo?.isAfter()
                  ? 'You can only reduce your contribution during the grace period. Reducing cannot be reversed.'
                  : 'Increase or reduce your contribution.'}
              </p>
            </>
          )}
        </div>

        <AmountInput
          title={isDeposit ? 'I want to deposit' : 'Withdraw collateral'}
          placeholder="0"
          maxValue={totalBalance.toString()}
          maxIsLoading={refreshing}
          maxLabel={isDeposit ? `Balance:` : `max withdraw:`}
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
            onClick={() => handleSetContribution()}
            className="w-full my-4"
            disabled={disableSubmit}
          >
            <div className={`flex items-center justify-center`}>
              {dontAddMore
                ? "Sorry you can't add anymore 🥲"
                : !hasUSDC && connected
                ? 'Your USDC balance is 0'
                : isDeposit
                ? `Deposit`
                : `Withdraw`}
            </div>
          </Button>
        ) : (
          <Button className="w-full my-4" disabled>
            <div className={`flex items-center justify-center`}>
              Country Not Allowed 🇺🇸😭
            </div>
          </Button>
        )}
        <StatsCard />
        {submitting ? (
          <div className="flex h-64 items-center justify-center">
            <Loading className="h-6 w-6 mb-3 text-primary-light" />
          </div>
        ) : (
          <>
            <div
              className={`${
                connected ? 'opacity-100' : 'opacity-30'
              } pb-6 transition-all duration-1000 w-full`}
            >
              <div className="flex justify-between pb-2">
                <div className="flex items-center text-xs text-fgd-4">
                  <a
                    onClick={handleRefresh}
                    className={
                      refreshing ? 'animate-spin' : 'hover:cursor-pointer'
                    }
                  >
                    <RefreshIcon
                      className={`w-4 h-4`}
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  </a>

                  {connected ? (
                    loading ? (
                      <div className="bg-bkg-4 rounded w-10 h-4 animate-pulse" />
                    ) : (
                      <span
                        className="font-display text-fgd-3 ml-1"
                        title="Wallet USDC"
                      >
                        {totalBalance}
                      </span>
                    )
                  ) : (
                    '----'
                  )}
                  <img
                    alt=""
                    title="Wallet USDC"
                    width="16"
                    height="16"
                    src="/icons/usdc.svg"
                    className="ml-1 opacity-75"
                  />
                </div>
                <div className="flex">
                  {submitted ? (
                    <SmallButton
                      className="ring-1 ring-secondary-1-light ring-inset hover:ring-secondary-1-dark hover:bg-transparent hover:text-secondary-1-dark font-normal rounded text-secondary-1-light text-xs py-0.5 px-1.5 mr-2"
                      disabled={!connected}
                      onClick={() => handleEditContribution()}
                    >
                      Unlock
                    </SmallButton>
                  ) : null}
                  <SmallButton
                    className={`${
                      disableFormInputs && 'opacity-30'
                    } bg-bkg-4 hover:bg-bkg-3 font-normal rounded text-fgd-3 text-xs py-0.5 px-1.5`}
                    disabled={disableFormInputs}
                  >
                    Max
                  </SmallButton>
                </div>
              </div>
              <div className="flex items-center pb-4 relative">
                {submitted ? (
                  <LockClosedIcon className="absolute text-secondary-2-light h-4 w-4 mb-0.5 left-2 z-10" />
                ) : null}
                {editContribution ? (
                  <LockOpenIcon className="absolute text-secondary-1-light h-4 w-4 mb-0.5 left-2 z-10" />
                ) : null}
                <Input
                  className={(submitted || editContribution) && 'pl-7'}
                  disabled={disableFormInputs}
                  type="text"
                  onChange={e => onChangeAmountInput(e.target.value)}
                  value={loading ? '' : inputAmount}
                  suffix="USDC"
                />
              </div>
              <div
                className={`${
                  !submitted ? 'opacity-100' : 'opacity-30'
                } transiton-all duration-1000`}
              >
                <div className="pb-12">
                  {/* <Slider
                    disabled={disableFormInputs}
                    value={(100 * inputAmount) / totalBalance}
                    onChange={v => onChangeSlider(v)}
                    step={1}
                    maxButtonTransition={maxButtonTransition}
                  /> */}
                </div>
                <div className="h-12 pb-4">
                  {errorMessage && (
                    <div className="flex items-center pt-1.5 text-secondary-2-light">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1.5" />
                      {errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* <ConnectWalletButton /> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContributionCard;
