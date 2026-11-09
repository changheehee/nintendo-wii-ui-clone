import { Suspense, useEffect, useRef, useState } from 'react';
import { BRAND_NAME } from '../../brandName.ts';
import type { Channel } from '../../channels/channelList.ts';
import { useKeyDown } from '../../input/useKeyDown.ts';
import './channelScreen.css';
import { FIRST_SLOT_INDEX, LAST_SLOT_INDEX, findChannelInSlot } from '../channelSlots.ts';
import { SideArrow } from '../controls/SideArrow.tsx';

type ChannelScreenProps = {
  readonly slotIndex: number;
  readonly onShowSlot: (slotIndex: number) => void;
  readonly onReturnToMenu: () => void;
};

type SlotViewProps = {
  readonly channel: Channel | undefined;
  readonly playCount: number;
};

const FIRST_PLAY_COUNT = 1;
const RETURN_KEYS: readonly string[] = ['Escape'];

export function ChannelScreen({ slotIndex, onShowSlot, onReturnToMenu }: ChannelScreenProps) {
  const [playCount, setPlayCount] = useState(FIRST_PLAY_COUNT);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const channel = findChannelInSlot(slotIndex);
  const isEmptySlot = channel === undefined;
  const isFirstSlot = slotIndex === FIRST_SLOT_INDEX;
  const isLastSlot = slotIndex === LAST_SLOT_INDEX;

  useEffect(function focusStartButton() {
    startButtonRef.current!.focus();
  }, []);

  useKeyDown(RETURN_KEYS, onReturnToMenu);

  function playChannelAgain() {
    setPlayCount(playCount + 1);
  }

  function showPreviousSlot() {
    const previousSlotIndex = slotIndex - 1;
    onShowSlot(previousSlotIndex);

    if (previousSlotIndex === FIRST_SLOT_INDEX) {
      menuButtonRef.current!.focus();
    }
  }

  function showNextSlot() {
    const nextSlotIndex = slotIndex + 1;
    onShowSlot(nextSlotIndex);

    if (nextSlotIndex === LAST_SLOT_INDEX) {
      menuButtonRef.current!.focus();
    }
  }

  return (
    <section className="channel-screen" aria-label={describeSlot(slotIndex, channel)}>
      <div className="channel-screen-frame">
        <div className="channel-screen-content">
          <div key={slotIndex} className="channel-screen-slot">
            <SlotView channel={channel} playCount={playCount} />
          </div>
        </div>
        <div className="channel-screen-bar">
          <button ref={menuButtonRef} className="channel-screen-pill" type="button" onClick={onReturnToMenu}>
            {BRAND_NAME} Menu
          </button>
          <button
            ref={startButtonRef}
            className="channel-screen-pill"
            type="button"
            disabled={isEmptySlot}
            onClick={playChannelAgain}
          >
            Start
          </button>
        </div>
      </div>
      <SideArrow placement="channel" direction="previous" label="이전 채널" isHidden={isFirstSlot} onClick={showPreviousSlot} />
      <SideArrow placement="channel" direction="next" label="다음 채널" isHidden={isLastSlot} onClick={showNextSlot} />
    </section>
  );
}

function describeSlot(slotIndex: number, channel: Channel | undefined): string {
  const slotNumber = slotIndex + 1;

  if (channel === undefined) {
    return `${slotNumber}번 빈 채널`;
  }

  return `${slotNumber}번 ${channel.title}`;
}

function SlotView({ channel, playCount }: SlotViewProps) {
  if (channel === undefined) {
    return <EmptySlotView />;
  }

  const { Screen } = channel;

  return (
    <Suspense fallback={null}>
      <Screen playCount={playCount} />
    </Suspense>
  );
}

function EmptySlotView() {
  return (
    <div className="channel-screen-empty" aria-hidden="true">
      <span className="channel-screen-empty-label">{BRAND_NAME}</span>
    </div>
  );
}
