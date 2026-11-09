import { useEffect, useState } from 'react';
import { playAudio } from '../audio/playAudio.ts';
import menuAmbienceUrl from './assets/menuAmbience.ogg';

export type MenuAmbience = {
  readonly fadeIn: () => void;
  readonly fadeOut: () => void;
};

type AmbiencePlayer = MenuAmbience & {
  readonly stop: () => void;
};

const AMBIENCE_VOLUME = 0.22;
const SILENT_VOLUME = 0;
const FADE_MILLISECONDS = 700;

export function useMenuAmbience(): MenuAmbience {
  const [ambience] = useState(createMenuAmbience);

  useEffect(
    function playWhileMenuIsShown() {
      ambience.fadeIn();

      return function stopWhenMenuCloses() {
        ambience.stop();
      };
    },
    [ambience],
  );

  return ambience;
}

function createMenuAmbience(): AmbiencePlayer {
  const music = new Audio(menuAmbienceUrl);
  let fadeFrameId = 0;

  music.loop = true;
  music.volume = SILENT_VOLUME;

  function fadeIn() {
    playAudio(music, '메뉴 배경음');
    fadeVolumeTo(AMBIENCE_VOLUME);
  }

  function fadeOut() {
    fadeVolumeTo(SILENT_VOLUME);
  }

  function stop() {
    cancelAnimationFrame(fadeFrameId);
    music.pause();
    music.volume = SILENT_VOLUME;
  }

  function fadeVolumeTo(targetVolume: number) {
    const startVolume = music.volume;
    let firstFrameTime: DOMHighResTimeStamp | null = null;

    function stepFade(now: DOMHighResTimeStamp) {
      if (firstFrameTime === null) {
        firstFrameTime = now;
      }

      const progress = Math.min((now - firstFrameTime) / FADE_MILLISECONDS, 1);
      music.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        fadeFrameId = requestAnimationFrame(stepFade);
        return;
      }

      if (targetVolume === SILENT_VOLUME) {
        music.pause();
      }
    }

    cancelAnimationFrame(fadeFrameId);
    fadeFrameId = requestAnimationFrame(stepFade);
  }

  return { fadeIn, fadeOut, stop };
}
