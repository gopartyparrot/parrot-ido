import classNames from 'classnames'

export interface SpinnerProps {
  size?: 'sm' | 'md'
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({ /*size = 'sm',*/ className }) => {
  // TODO: handle size params
  return (
    <span
      className={classNames(
        'inline-block loader ease-linear rounded-full border-2 border-t-2 h-4 w-4',
        className
      )}
    />
  )
}

export default Spinner
