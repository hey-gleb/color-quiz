import type { AudioContextType } from '@/context/AudioContext.tsx';
import { AudioContext } from '@/context/AudioContext.tsx';
import { useContext } from 'react';

const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default useAudio;
