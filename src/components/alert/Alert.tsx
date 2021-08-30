import { default as ReachAlert } from '@reach/alert';
import classNames from 'classnames';
import { useCallback } from 'react';

import { AlertProps, AlertTypes } from './types';

let globalId = 0;

const nextId = () => {
  return `${new Date().valueOf()}_${globalId++}`;
};

const getIcon = (type: AlertTypes = AlertTypes.INFO) => {
  switch (type) {
    case AlertTypes.FAILURE:
      return '✕';
    case AlertTypes.WARNING:
      return '';
    case AlertTypes.SUCCESS:
      return '✓';
    case AlertTypes.INFO:
    default:
      return '';
  }
};

const Alert: React.FC<AlertProps> = ({ message, children, type, onClick }) => {
  const Icon = getIcon(type);

  const handleClose = useCallback(
    evt => {
      if (onClick) {
        onClick(evt);
      }
    },
    [onClick]
  );

  return (
    <ReachAlert
      className="alert-shadow rounded bg-white p-4 text-sm flex flex-row items-center"
      key={nextId()}
      onClick={handleClose}
    >
      <div
        className={classNames(
          'text-white text-xs mr-3 icon h-5 w-5 rounded-full flex-grow-0 flex-shrink-0 flex items-center justify-center',
          {
            'bg-success': type === AlertTypes.SUCCESS,
            'bg-failure': type === AlertTypes.FAILURE,
            'bg-warning': type === AlertTypes.WARNING,
            'bg-lightgray': type === AlertTypes.INFO
          }
        )}
      >
        {Icon}
      </div>
      <div className="space-y-1 leading-snug w-full overflow-y-auto">
        {message.split('\n').map((i, key) => {
          return <div key={key}>{i}</div>;
        })}
        {children}
      </div>
    </ReachAlert>
  );
};

export default Alert;
