import type { ReactNode } from 'react';
import roundButtonUrl from './assets/roundButton@2x.png';
import './roundButton.css';

type RoundButtonProps = {
  readonly className: string;
  readonly label: string;
  readonly children: ReactNode;
};

export function RoundButton({ className, label, children }: RoundButtonProps) {
  return (
    <button className={`round-button ${className}`} type="button" aria-label={label}>
      <img className="round-button-face" src={roundButtonUrl} alt="" />
      <span className="round-button-content">{children}</span>
    </button>
  );
}
