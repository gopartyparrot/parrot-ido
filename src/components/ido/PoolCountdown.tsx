import usePool from '../../hooks/usePool';
import Countdown from 'react-countdown';
import moment from 'moment';
import { ClockIcon } from '@heroicons/react/outline';

const PoolCountdown = (props: { className?: string; date: moment.Moment }) => {
  const { endIdo, endDeposits } = usePool();
  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    hours += days * 24;
    const message =
      endDeposits?.isBefore() && endIdo?.isAfter()
        ? 'Deposits are closed'
        : 'The IDO has ended';
    if (completed) {
      return <p className="text-sm mt-2">{message}</p>;
    } else {
      return (
        <div className={`${props.className} flex items-center`}>
          <div className="flex flex-col">
            <span className="bg-black text-white font-bold mx-1 w-8 inline-block py-2 rounded">
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span className="text-xs mt-1 text-secondary">hrs</span>
          </div>
          <div className="flex flex-col">
            <span className="bg-black text-white font-bold mx-1 w-8 inline-block py-2 rounded">
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span className="text-xs mt-1 text-secondary">mins</span>
          </div>
          <div className="flex flex-col">
            <span className="bg-black text-white font-bold mx-1 w-8 inline-block py-2 rounded">
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span className="text-xs mt-1 text-secondary">secs</span>
          </div>
        </div>
      );
    }
  };

  if (props.date) {
    return <Countdown date={props.date.format()} renderer={renderCountdown} />;
  } else {
    return null;
  }
};

export default PoolCountdown;
