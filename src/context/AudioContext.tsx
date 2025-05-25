import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { SOUND_ASSETS_FILE_PATH_BASE } from '@/const.ts';

type SoundMap = {
  correctAnswer: HTMLAudioElement;
  wrongAnswer: HTMLAudioElement;
  gameOver: HTMLAudioElement;
};

type AudioContextType = {
  play: (sound: keyof SoundMap) => void;
  toggleMute: () => void;
  isMuted: boolean;
};

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  const sounds = useRef<SoundMap>({
    correctAnswer: new Audio(
      `${SOUND_ASSETS_FILE_PATH_BASE}/correct-answer.mp3`
    ),
    wrongAnswer: new Audio(`${SOUND_ASSETS_FILE_PATH_BASE}/wrong-answer.mp3`),
    gameOver: new Audio(`${SOUND_ASSETS_FILE_PATH_BASE}/game-over.mp3`),
  });

  useEffect(() => {
    Object.values(sounds.current).forEach((audio) => {
      audio.load();
    });
  });

  const play = useCallback(
    (sound: keyof SoundMap) => {
      const audio = sounds.current[sound];
      if (audio && !isMuted) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    },
    [isMuted]
  );

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AudioContext.Provider value={{ play, toggleMute, isMuted }}>
      {children}
    </AudioContext.Provider>
  );
};

export type { AudioContextType };
