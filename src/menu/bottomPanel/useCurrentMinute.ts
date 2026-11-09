import { useEffect, useState } from 'react';

const MILLISECONDS_PER_MINUTE = 60_000;

export function useCurrentMinute(): Date {
  const [now, setNow] = useState(readNow);

  useEffect(function updateAtEveryMinute() {
    let timerId = 0;

    function showNextMinute() {
      setNow(readNow());
      waitForNextMinute();
    }

    function waitForNextMinute() {
      timerId = window.setTimeout(showNextMinute, readMillisecondsToNextMinute());
    }

    waitForNextMinute();

    return function stopUpdating() {
      window.clearTimeout(timerId);
    };
  }, []);

  return now;
}

function readNow(): Date {
  return new Date();
}

function readMillisecondsToNextMinute(): number {
  return MILLISECONDS_PER_MINUTE - (Date.now() % MILLISECONDS_PER_MINUTE);
}
