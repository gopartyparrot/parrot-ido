import { MouseEvent, ReactNode } from 'react';

export type AlertTheme = {
  background: string;
};

export enum AlertTypes {
  INFO = 'info',
  FAILURE = 'danger',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export interface AlertProps {
  type?: AlertTypes;
  title: string;
  message: string;
  children?: ReactNode;
  onClick?: (evt: MouseEvent<HTMLButtonElement>) => void;
}
