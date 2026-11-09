import { useState } from 'react';
import type { RefObject } from 'react';
import { flushSync } from 'react-dom';

type ChannelZoomOptions = {
  readonly gridRef: RefObject<HTMLDivElement | null>;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly revealPageOfSlot: (slotIndex: number) => void;
};

export type ChannelZoom = {
  readonly openedSlotIndex: number | null;
  readonly zoomIntoSlot: (slotIndex: number) => void;
  readonly zoomOutToSlot: (slotIndex: number) => void;
  readonly showSlot: (slotIndex: number) => void;
};

const CHANNEL_ZOOM_NAME = 'channel-zoom';

export function useChannelZoom({ gridRef, onZoomIn, onZoomOut, revealPageOfSlot }: ChannelZoomOptions): ChannelZoom {
  const [openedSlotIndex, setOpenedSlotIndex] = useState<number | null>(null);

  function zoomIntoSlot(slotIndex: number) {
    const slot = findSlotElement(gridRef.current!, slotIndex);
    onZoomIn();
    slot.style.viewTransitionName = CHANNEL_ZOOM_NAME;

    document.startViewTransition(function swapCardForChannelScreen() {
      slot.style.viewTransitionName = 'none';
      flushSync(function showChannelScreen() {
        setOpenedSlotIndex(slotIndex);
      });
    });
  }

  function zoomOutToSlot(slotIndex: number) {
    onZoomOut();

    const transition = document.startViewTransition(function swapChannelScreenForCard() {
      flushSync(function showMenuAtSlot() {
        revealPageOfSlot(slotIndex);
        setOpenedSlotIndex(null);
      });
      findSlotElement(gridRef.current!, slotIndex).style.viewTransitionName = CHANNEL_ZOOM_NAME;
    });

    transition.finished.then(function finishZoomOut() {
      const slot = findSlotElement(gridRef.current!, slotIndex);
      slot.style.viewTransitionName = 'none';
      focusChannelButton(slot);
    });
  }

  return { openedSlotIndex, zoomIntoSlot, zoomOutToSlot, showSlot: setOpenedSlotIndex };
}

function findSlotElement(grid: HTMLElement, slotIndex: number): HTMLElement {
  const slot = grid.querySelector<HTMLElement>(`[data-slot-index="${slotIndex}"]`);

  if (slot === null) {
    throw new Error(`${slotIndex}번 채널 칸을 화면에서 찾지 못했습니다.`);
  }

  return slot;
}

function focusChannelButton(slot: HTMLElement) {
  const channelButton = slot.querySelector('button');

  if (channelButton !== null) {
    channelButton.focus();
  }
}
