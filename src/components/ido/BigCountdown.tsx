import classNames from 'classnames'
import moment from 'moment'
import Countdown from 'react-countdown'

import { useRefresh } from '../../hooks/useRefresh'

interface CountdownBlockProps {
  count: string
  label: string
  isLast?: boolean
}

const CountdownBlock: React.FC<CountdownBlockProps> = ({
  count,
  label,
  isLast,
}) => {
  return (
    <>
      <div className="bg-tertiary flex flex-col items-center w-14 sm:w-100 pt-4 rounded-xl overflow-hidden">
        <div className="text-brandPrimary text-lg sm:text-xxl text-center font-bold">
          {count}
        </div>
        <div className="text-xxs sm:text-md text-center bg-white py-2 w-full mt-2 sm:mt-4">
          {label}
        </div>
      </div>
      {!isLast && (
        <div className="text-brandPrimary text-lg sm:text-xxl px-2 sm:px-4 mb-6 font-bold sm:mb-12">
          :
        </div>
      )}
    </>
  )
}

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
            'flex items-center justify-center mt-6 mb-10 sm:mb-16'
          )}
        >
          <CountdownBlock count={days} label="DAYS" />
          <CountdownBlock count={hours} label="HOURS" />
          <CountdownBlock count={minutes} label="MINS" />
          <CountdownBlock count={seconds} label="SECS" isLast />
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
