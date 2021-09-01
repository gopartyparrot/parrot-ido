import React, { useCallback, useEffect, useState } from 'react';
import 'twin.macro';
import useIpAddress from '../../hooks/useIpAddress';
import useLargestAccounts from '../../hooks/useLargestAccounts';
import usePool from '../../hooks/usePool';
import useWalletStore from '../../stores/useWalletStore';
import { notify } from '../../utils/notifications';
import { Button } from '../button';
import { AmountInput } from '../input/AmountInput';
import Loading from '../Loading';
import { ButtonMenu, ButtonMenuItem } from '../menu';
import StatsCard from './StatsCard';

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

  const [isDeposit, setIsDeposit] = useState(true);

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

  const handleChangeMode = useCallback(
    (value: number) => {
      setIsDeposit(value === 0);
    },
    [setIsDeposit]
  );

  const onChangeAmountInput = (amount: string) => {
    setInputAmount(amount);
    if (endDeposits?.isBefore() && +amount > redeemableBalance) {
      setErrorMessage('Deposits ended, contribution cannot increase');
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      // setWalletAmount(totalBalance - amount);
    }
  };

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
        <ButtonMenu
          activeIndex={isDeposit ? 0 : 1}
          onItemClick={handleChangeMode}
        >
          <ButtonMenuItem>Deposit</ButtonMenuItem>
          <ButtonMenuItem>Withdraw</ButtonMenuItem>
        </ButtonMenu>
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
          <div />
        )}
      </div>
    </div>
  );
};

export default ContributionCard;
