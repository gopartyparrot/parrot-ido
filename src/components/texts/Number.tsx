import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import NumberFormat, { NumberFormatPropsBase } from 'react-number-format'

interface NumberTextProps extends Omit<NumberFormatPropsBase, 'value'> {
  value?: BigNumber.Value
  className?: string
  displayValue?: string
  displayMax?: number
  defaultIfNull?: string
  /**
   * Handle decimals for integers values
   * Example: value=100000 valueDecimals=2 => 1000.00
   * Default is 0, meaning display the value as it is
   */
  valueDecimals?: number
  displayDecimals?: number
  roundMode?: BigNumber.RoundingMode
}

const NumberText: React.FC<NumberTextProps> = ({
  value,
  displayMax,
  defaultIfNull = '',
  valueDecimals = 0,
  displayDecimals = 2,
  roundMode = BigNumber.ROUND_FLOOR,
  ...others
}) => {
  const { result: formattedValue, prefix } = useMemo(() => {
    const resValue = new BigNumber(value || 0)
      .dividedBy(new BigNumber(10).pow(valueDecimals))
      .decimalPlaces(displayDecimals, roundMode)
    const maxValue = new BigNumber(displayMax || '0')

    let result = value ? resValue.toFixed(displayDecimals) : defaultIfNull
    if (displayMax && value && !resValue.isNaN() && resValue.gt(maxValue)) {
      result = `${displayMax}`
      others.prefix = '>'
    }
    return { result, prefix: others.prefix }
  }, [value, displayMax])

  if (formattedValue === defaultIfNull) {
    return (
      <div className={others.className}>
        {defaultIfNull}
        {defaultIfNull === 'N/A' ? '' : others.suffix || ''}
      </div>
    )
  }

  return (
    <NumberFormat
      thousandSeparator
      value={formattedValue}
      displayType="text"
      {...others}
      prefix={prefix}
    />
  )
}

export default NumberText
