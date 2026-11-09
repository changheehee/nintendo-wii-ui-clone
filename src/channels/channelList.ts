import { lazy } from 'react';
import type { ComponentType } from 'react';
import { CatCard } from './cat/CatCard.tsx';

export type ChannelScreenProps = {
  readonly playCount: number;
};

type ChannelScreenModule = {
  readonly default: ComponentType<ChannelScreenProps>;
};

export type Channel = {
  readonly id: string;
  readonly title: string;
  readonly Card: ComponentType;
  readonly Screen: ComponentType<ChannelScreenProps>;
  readonly preloadScreen: () => Promise<ChannelScreenModule>;
};

function loadCatScreen(): Promise<ChannelScreenModule> {
  return import('./cat/CatScreen.tsx').then(function pickCatScreen(module) {
    return { default: module.CatScreen };
  });
}

export const CHANNEL_LIST: readonly Channel[] = [
  { id: 'oiia-cat', title: '고양이 채널', Card: CatCard, Screen: lazy(loadCatScreen), preloadScreen: loadCatScreen },
];

export function preloadChannelScreens() {
  for (const channel of CHANNEL_LIST) {
    channel.preloadScreen().catch(reportPreloadFailure);
  }
}

function reportPreloadFailure(error: unknown) {
  console.error('채널 화면을 미리 불러오지 못했습니다.', error);
}
