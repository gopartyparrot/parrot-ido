import React from 'react';
import Link from '../Link';

import { ToastAction as Action } from './types';

interface ToastActionProps {
  action: Action;
}

const ToastAction: React.FC<ToastActionProps> = ({ action }) => {
  return <Link>{action.text}</Link>;
};

export default ToastAction;
