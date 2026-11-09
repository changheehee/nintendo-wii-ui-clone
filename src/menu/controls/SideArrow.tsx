import type { Ref } from 'react';
import sideArrowUrl from './assets/sideArrow@2x.png';
import './sideArrow.css';

type ArrowDirection = 'previous' | 'next';

type ArrowPlacement = 'menu' | 'channel';

type SideArrowProps = {
  readonly ref?: Ref<HTMLButtonElement>;
  readonly placement: ArrowPlacement;
  readonly direction: ArrowDirection;
  readonly label: string;
  readonly isHidden: boolean;
  readonly onClick: () => void;
};

export function SideArrow({ ref, placement, direction, label, isHidden, onClick }: SideArrowProps) {
  return (
    <button
      ref={ref}
      className="side-arrow"
      type="button"
      data-placement={placement}
      data-direction={direction}
      hidden={isHidden}
      aria-label={label}
      onClick={onClick}
    >
      <img className="side-arrow-icon" src={sideArrowUrl} alt="" />
    </button>
  );
}
