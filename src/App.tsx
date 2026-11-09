import { useState } from 'react';
import './app.css';
import { MainMenu } from './menu/MainMenu.tsx';
import { WarningScreen } from './warning/WarningScreen.tsx';

type StartupStep = 'warning' | 'leavingWarning' | 'menu';

type CurrentScreenProps = {
  readonly step: StartupStep;
  readonly onContinue: () => void;
  readonly onWarningFadedOut: () => void;
};

export function App() {
  const [step, setStep] = useState<StartupStep>('warning');

  function leaveWarning() {
    setStep('leavingWarning');
  }

  function showMenu() {
    setStep('menu');
  }

  return (
    <div className="stage">
      <CurrentScreen step={step} onContinue={leaveWarning} onWarningFadedOut={showMenu} />
    </div>
  );
}

function CurrentScreen({ step, onContinue, onWarningFadedOut }: CurrentScreenProps) {
  if (step === 'menu') {
    return <MainMenu />;
  }

  return <WarningScreen isLeaving={step === 'leavingWarning'} onContinue={onContinue} onFadedOut={onWarningFadedOut} />;
}
