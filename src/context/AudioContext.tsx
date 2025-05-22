import React, { createContext, useEffect, useRef } from 'react';

import { SOUND_ASSETS_FILE_PATH_BASE } from '@/const.ts';

type SoundMap = {
  correctAnswer: HTMLAudioElement;
  wrongAnswer: HTMLAudioElement;
};

type AudioContextType = {
  play: (sound: keyof SoundMap) => void;
};

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const sounds = useRef<SoundMap>({
    correctAnswer: new Audio(
      `${SOUND_ASSETS_FILE_PATH_BASE}/correct-answer.mp3`
    ),
    wrongAnswer: new Audio(`${SOUND_ASSETS_FILE_PATH_BASE}/wrong-answer.mp3`),
  });

  useEffect(() => {
    Object.values(sounds.current).forEach((audio) => {
      audio.load();
    });
  });

  const play = (sound: keyof SoundMap) => {
    const audio = sounds.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  };

  return (
    <AudioContext.Provider value={{ play }}>{children}</AudioContext.Provider>
  );
};

export type { AudioContextType };
