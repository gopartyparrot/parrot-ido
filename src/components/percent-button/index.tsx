import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { useCallback, useMemo } from 'react'

interface PercentButtonProps {
  disabled?: boolean
  current: string
  max: string
  maxPercentage: number
  onChange: (value: string) => void
}

const PercentButton: React.FC<PercentButtonProps> = ({
  disabled,
  max,
  maxPercentage,
  onChange,
}) => {
  const percentages = useMemo(
    () => [
      { label: '25%', value: 25 },
      { label: '50%', value: 50 },
      { label: '75%', value: 75 },
      { label: '100%', value: maxPercentage },
    ],
    [maxPercentage]
  )

  const handleChange = useCallback(
    (per: number) => () => {
      onChange(new BigNumber(max).multipliedBy(per / 100).toString())
    },
    [max, onChange]
  )

  return (
    <div className={classNames('flex flex-row items-center -mx-2')}>
      {percentages.map((per) => (
        <button
          key={per.value}
          disabled={disabled}
          className={classNames(
            'px-2 outline-none focus:outline-none text-tertiary',
            {}
          )}
          onClick={handleChange(per.value)}
        >
          {per.label}
        </button>
      ))}
    </div>
  )
}

export default PercentButton
