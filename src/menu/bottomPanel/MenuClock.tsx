import './menuClock.css';
import { useCurrentMinute } from './useCurrentMinute.ts';

const SHORT_ENGLISH_WEEKDAY: Intl.DateTimeFormatOptions = { weekday: 'short' };

export function MenuClock() {
  const now = useCurrentMinute();
  const hourText = String(now.getHours());
  const minuteText = padTwoDigits(now.getMinutes());

  return (
    <>
      <time className="menu-clock-time" dateTime={`${padTwoDigits(now.getHours())}:${minuteText}`}>
        {hourText}
        <span className="menu-clock-colon">:</span>
        {minuteText}
      </time>
      <time className="menu-clock-date" dateTime={formatIsoDate(now)}>
        {formatMenuDate(now)}
      </time>
    </>
  );
}

function formatMenuDate(time: Date): string {
  const weekdayName = time.toLocaleDateString('en-US', SHORT_ENGLISH_WEEKDAY);

  return `${weekdayName} ${padTwoDigits(time.getDate())}/${padTwoDigits(readMonthNumber(time))}`;
}

function formatIsoDate(time: Date): string {
  return `${time.getFullYear()}-${padTwoDigits(readMonthNumber(time))}-${padTwoDigits(time.getDate())}`;
}

function readMonthNumber(time: Date): number {
  return time.getMonth() + 1;
}

function padTwoDigits(value: number): string {
  return String(value).padStart(2, '0');
}
