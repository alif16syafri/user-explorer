import cx from 'classnames';

import type { FC } from 'react';

import styles from './index.module.scss';

type Props = {
  className?: string;
}

export const Loading: FC<Props> = ({ className }) => (
  <div className={cx(styles.loading, className)}>
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);
