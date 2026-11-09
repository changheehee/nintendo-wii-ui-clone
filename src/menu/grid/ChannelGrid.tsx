import type { Ref } from 'react';
import { BRAND_NAME } from '../../brandName.ts';
import type { Channel } from '../../channels/channelList.ts';
import channelCardUrl from './assets/channelCard@2x.png';
import channelCardHighlightUrl from './assets/channelCardHighlight@2x.png';
import './channelGrid.css';
import { PAGE_COUNT, SLOTS_PER_PAGE, findChannelInSlot } from '../channelSlots.ts';

export type PagingMotion = 'slide' | 'instant';

type OpenChannel = (slotIndex: number) => void;

type ChannelGridProps = {
  readonly ref: Ref<HTMLDivElement>;
  readonly pageIndex: number;
  readonly paging: PagingMotion;
  readonly onOpenChannel: OpenChannel;
};

type ChannelPageProps = {
  readonly pageIndex: number;
  readonly isNearCurrentPage: boolean;
  readonly onOpenChannel: OpenChannel;
};

type ChannelSlotProps = {
  readonly slotIndex: number;
  readonly onOpenChannel: OpenChannel;
};

type FilledChannelProps = {
  readonly slotIndex: number;
  readonly channel: Channel;
  readonly onOpenChannel: OpenChannel;
};

type EmptyChannelProps = {
  readonly slotIndex: number;
};

const NEARBY_PAGE_DISTANCE = 1;
const PAGE_INDEXES = Array.from({ length: PAGE_COUNT }, readIndex);
const SLOT_POSITIONS = Array.from({ length: SLOTS_PER_PAGE }, readIndex);

export function ChannelGrid({ ref, pageIndex, paging, onOpenChannel }: ChannelGridProps) {
  return (
    <div ref={ref} className="channel-grid" data-paging={paging} style={{ '--page-index': pageIndex }}>
      {PAGE_INDEXES.map(function renderChannelPage(index) {
        const isNearCurrentPage = Math.abs(index - pageIndex) <= NEARBY_PAGE_DISTANCE;

        return <ChannelPage key={index} pageIndex={index} isNearCurrentPage={isNearCurrentPage} onOpenChannel={onOpenChannel} />;
      })}
    </div>
  );
}

function ChannelPage({ pageIndex, isNearCurrentPage, onOpenChannel }: ChannelPageProps) {
  return (
    <ul className="channel-page" data-near-current={isNearCurrentPage} aria-label={`채널 ${pageIndex + 1}쪽`}>
      {SLOT_POSITIONS.map(function renderChannelSlot(slotPosition) {
        const slotIndex = pageIndex * SLOTS_PER_PAGE + slotPosition;

        return <ChannelSlot key={slotIndex} slotIndex={slotIndex} onOpenChannel={onOpenChannel} />;
      })}
    </ul>
  );
}

function ChannelSlot({ slotIndex, onOpenChannel }: ChannelSlotProps) {
  const channel = findChannelInSlot(slotIndex);

  if (channel === undefined) {
    return <EmptyChannel slotIndex={slotIndex} />;
  }

  return <FilledChannel slotIndex={slotIndex} channel={channel} onOpenChannel={onOpenChannel} />;
}

function FilledChannel({ slotIndex, channel, onOpenChannel }: FilledChannelProps) {
  const { Card } = channel;

  function openThisChannel() {
    onOpenChannel(slotIndex);
  }

  return (
    <li className="channel-card" data-slot-index={slotIndex}>
      <button className="channel-card-button" type="button" aria-label={`${channel.title} 열기`} onClick={openThisChannel}>
        <img className="channel-card-frame" src={channelCardUrl} alt="" />
        <span className="channel-card-inside">
          <Card />
        </span>
        <img className="channel-card-highlight" src={channelCardHighlightUrl} alt="" />
      </button>
    </li>
  );
}

function EmptyChannel({ slotIndex }: EmptyChannelProps) {
  return (
    <li className="channel-card" data-slot-index={slotIndex} aria-label="빈 채널">
      <img className="channel-card-frame" src={channelCardUrl} alt="" />
      <span className="channel-card-inside channel-card-screen" aria-hidden="true">
        <span className="channel-card-label">{BRAND_NAME}</span>
      </span>
    </li>
  );
}

function readIndex(_value: unknown, index: number): number {
  return index;
}
