import { CHANNEL_LIST } from '../channels/channelList.ts';
import type { Channel } from '../channels/channelList.ts';

const COLUMNS_PER_PAGE = 4;
const ROWS_PER_PAGE = 3;

export const PAGE_COUNT = 4;
export const SLOTS_PER_PAGE = COLUMNS_PER_PAGE * ROWS_PER_PAGE;
export const FIRST_SLOT_INDEX = 0;
export const LAST_SLOT_INDEX = PAGE_COUNT * SLOTS_PER_PAGE - 1;

export function findChannelInSlot(slotIndex: number): Channel | undefined {
  return CHANNEL_LIST[slotIndex];
}

export function readPageIndexOfSlot(slotIndex: number): number {
  return Math.floor(slotIndex / SLOTS_PER_PAGE);
}
