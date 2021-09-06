import classNames from 'classnames'
import moment from 'moment'
import Countdown from 'react-countdown'

import { useRefresh } from '../../hooks/useRefresh'

interface PoolCountdownProps {
  date: moment.Moment
  poolStatus: string
  className?: string
}

const PoolCountdown: React.FC<PoolCountdownProps> = ({
  date,
  poolStatus,
  className,
}) => {
  const { doForceRefresh } = useRefresh()

  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    hours += days * 24
    if (completed) {
      return <p className="text-sm mt-2 py-2 text-center">{poolStatus}</p>
    } else {
      return (
        <div className={classNames(className, 'flex items-center')}>
          <div className="flex flex-col items-center">
            <span className="bg-black text-white text-center font-bold mx-1 w-8 inline-block py-2 rounded">
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span className="text-xs mt-1 text-secondary">hrs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-black text-white text-center font-bold mx-1 w-8 inline-block py-2 rounded">
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span className="text-xs mt-1 text-secondary">mins</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-black text-white text-center font-bold mx-1 w-8 inline-block py-2 rounded">
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span className="text-xs mt-1 text-secondary">secs</span>
          </div>
        </div>
      )
    }
  }

  if (date) {
    return (
      <Countdown
        date={date.format()}
        renderer={renderCountdown}
        onComplete={doForceRefresh}
      />
    )
  } else {
    return null
  }
}

export default PoolCountdown
