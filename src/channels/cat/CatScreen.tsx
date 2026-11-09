import { useEffect, useRef } from 'react';
import { playAudio } from '../../audio/playAudio.ts';
import type { ChannelScreenProps } from '../channelList.ts';
import './catChannel.css';
import oiiaSongUrl from './oiiaSong.mp3';
import { useCatStage } from './useCatStage.ts';

const SONG_VOLUME = 0.6;
const SONG_DELAY_MILLISECONDS = 600;

export function CatScreen({ playCount }: ChannelScreenProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useCatStage(stageRef, playCount);

  useEffect(
    function playSongAfterDelay() {
      const song = new Audio(oiiaSongUrl);
      song.volume = SONG_VOLUME;

      function startSong() {
        playAudio(song, '고양이 노래');
      }

      const timerId = setTimeout(startSong, SONG_DELAY_MILLISECONDS);

      return function stopSong() {
        clearTimeout(timerId);
        song.pause();
      };
    },
    [playCount],
  );

  return <div ref={stageRef} className="cat-channel-backdrop cat-screen-stage" />;
}
