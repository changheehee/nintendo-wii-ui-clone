import { useEffect, useRef } from 'react';
import { useKeyDown } from '../input/useKeyDown.ts';
import warningSignUrl from './assets/warningSign@2x.png';
import './warningScreen.css';

type WarningScreenProps = {
  readonly isLeaving: boolean;
  readonly onContinue: () => void;
  readonly onFadedOut: () => void;
};

const A_BUTTON_KEYS: readonly string[] = ['a', 'A'];

export function WarningScreen({ isLeaving, onContinue, onFadedOut }: WarningScreenProps) {
  const screenRef = useRef<HTMLButtonElement>(null);

  useEffect(function focusScreenForKeyboard() {
    screenRef.current!.focus();
  }, []);

  useKeyDown(A_BUTTON_KEYS, onContinue);

  function finishLeaving() {
    if (isLeaving) {
      onFadedOut();
    }
  }

  return (
    <button
      ref={screenRef}
      className="warning-screen"
      type="button"
      data-leaving={isLeaving}
      disabled={isLeaving}
      onClick={onContinue}
      onAnimationEnd={finishLeaving}
    >
      <span className="warning-screen-title">
        <img className="warning-screen-sign" src={warningSignUrl} alt="" />
        WARNING-HEALTH AND SAFETY
      </span>
      <span className="warning-screen-line warning-screen-line-1">BEFORE PLAYING, READ YOUR OPERATIONS</span>
      <span className="warning-screen-line warning-screen-line-2">MANUAL FOR IMPORTANT INFORMATION</span>
      <span className="warning-screen-line warning-screen-line-3">ABOUT YOUR HEALTH AND SAFETY.</span>
      <span className="warning-screen-online">Also online at</span>
      <span className="warning-screen-link">www.xxx.com/healthsafety/</span>
      <span className="warning-screen-continue">
        <span className="warning-screen-cap-text">Press</span>
        <span className="warning-screen-button-a">
          <span className="warning-screen-cap-text">A</span>
        </span>
        <span className="warning-screen-cap-text">to continue.</span>
      </span>
    </button>
  );
}
