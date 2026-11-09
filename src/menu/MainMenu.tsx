import { useEffect, useRef, useState } from 'react';
import { preloadChannelScreens } from '../channels/channelList.ts';
import { BottomPanel } from './bottomPanel/BottomPanel.tsx';
import { ChannelGrid } from './grid/ChannelGrid.tsx';
import type { PagingMotion } from './grid/ChannelGrid.tsx';
import { ChannelScreen } from './channelScreen/ChannelScreen.tsx';
import { PAGE_COUNT, readPageIndexOfSlot } from './channelSlots.ts';
import './mainMenu.css';
import { SideArrow } from './controls/SideArrow.tsx';
import { useChannelZoom } from './useChannelZoom.ts';
import { useMenuAmbience } from './useMenuAmbience.ts';

type OpenedChannelScreenProps = {
  readonly openedSlotIndex: number | null;
  readonly onShowSlot: (slotIndex: number) => void;
  readonly onClose: (slotIndex: number) => void;
};

const FIRST_PAGE_INDEX = 0;
const LAST_PAGE_INDEX = PAGE_COUNT - 1;

export function MainMenu() {
  const [pageIndex, setPageIndex] = useState(FIRST_PAGE_INDEX);
  const [paging, setPaging] = useState<PagingMotion>('slide');
  const gridRef = useRef<HTMLDivElement>(null);
  const previousArrowRef = useRef<HTMLButtonElement>(null);
  const nextArrowRef = useRef<HTMLButtonElement>(null);
  const ambience = useMenuAmbience();

  function revealPageOfSlot(slotIndex: number) {
    setPaging('instant');
    setPageIndex(readPageIndexOfSlot(slotIndex));
  }

  const channelZoom = useChannelZoom({
    gridRef,
    onZoomIn: ambience.fadeOut,
    onZoomOut: ambience.fadeIn,
    revealPageOfSlot,
  });
  const isFirstPage = pageIndex === FIRST_PAGE_INDEX;
  const isLastPage = pageIndex === LAST_PAGE_INDEX;
  const isChannelOpen = channelZoom.openedSlotIndex !== null;

  useEffect(function prepareChannelScreens() {
    preloadChannelScreens();
  }, []);

  function showPreviousPage() {
    const previousPageIndex = pageIndex - 1;
    setPaging('slide');
    setPageIndex(previousPageIndex);

    if (previousPageIndex === FIRST_PAGE_INDEX) {
      nextArrowRef.current!.focus();
    }
  }

  function showNextPage() {
    const nextPageIndex = pageIndex + 1;
    setPaging('slide');
    setPageIndex(nextPageIndex);

    if (nextPageIndex === LAST_PAGE_INDEX) {
      previousArrowRef.current!.focus();
    }
  }

  return (
    <main className="main-menu">
      <div className="main-menu-body" inert={isChannelOpen}>
        <ChannelGrid ref={gridRef} pageIndex={pageIndex} paging={paging} onOpenChannel={channelZoom.zoomIntoSlot} />
        <SideArrow
          ref={previousArrowRef}
          placement="menu"
          direction="previous"
          label="이전 페이지"
          isHidden={isFirstPage}
          onClick={showPreviousPage}
        />
        <SideArrow
          ref={nextArrowRef}
          placement="menu"
          direction="next"
          label="다음 페이지"
          isHidden={isLastPage}
          onClick={showNextPage}
        />
        <BottomPanel />
      </div>
      <OpenedChannelScreen
        openedSlotIndex={channelZoom.openedSlotIndex}
        onShowSlot={channelZoom.showSlot}
        onClose={channelZoom.zoomOutToSlot}
      />
    </main>
  );
}

function OpenedChannelScreen({ openedSlotIndex, onShowSlot, onClose }: OpenedChannelScreenProps) {
  if (openedSlotIndex === null) {
    return null;
  }

  const slotIndexToClose = openedSlotIndex;

  function closeThisChannel() {
    onClose(slotIndexToClose);
  }

  return <ChannelScreen slotIndex={slotIndexToClose} onShowSlot={onShowSlot} onReturnToMenu={closeThisChannel} />;
}
