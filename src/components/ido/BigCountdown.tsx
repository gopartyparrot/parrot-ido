import classNames from 'classnames'
import moment from 'moment'
import Countdown from 'react-countdown'

import { useRefresh } from '../../hooks/useRefresh'

interface BigCountdownProps {
  date: moment.Moment
  className?: string
}

const BigCountdown: React.FC<BigCountdownProps> = ({ date, className }) => {
  const { doForceRefresh } = useRefresh()

  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <div />
    } else {
      return (
        <div
          className={classNames(
            className,
            'flex items-center justify-center mb-16'
          )}
        >
          <div className="bg-tertiary flex flex-col items-center w-100 pt-4 rounded-xl overflow-hidden">
            <div className="text-brandPrimary text-xxl text-center font-bold">
              {days}
            </div>
            <div className="text-md text-center bg-white py-2 w-full mt-4">
              DAYS
            </div>
          </div>
          <div className="text-brandPrimary text-xxl px-4 mb-12">:</div>
          <div className="bg-tertiary flex flex-col items-center w-100 pt-4 rounded-xl overflow-hidden">
            <div className="text-brandPrimary text-xxl text-center font-bold">
              {hours}
            </div>
            <div className="text-md text-center bg-white py-2 w-full mt-4">
              HOURS
            </div>
          </div>
          <div className="text-brandPrimary text-xxl px-4 mb-12">:</div>
          <div className="bg-tertiary flex flex-col items-center w-100 pt-4 rounded-xl overflow-hidden">
            <div className="text-brandPrimary text-xxl text-center font-bold">
              {minutes}
            </div>
            <div className="text-md text-center bg-white py-2 w-full mt-4">
              MINS
            </div>
          </div>
          <div className="text-brandPrimary text-xxl px-4 mb-12">:</div>
          <div className="bg-tertiary flex flex-col items-center w-100 pt-4 rounded-xl overflow-hidden">
            <div className="text-brandPrimary text-xxl text-center font-bold">
              {seconds}
            </div>
            <div className="text-md text-center bg-white py-2 w-full mt-4">
              SECS
            </div>
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

export default BigCountdown
