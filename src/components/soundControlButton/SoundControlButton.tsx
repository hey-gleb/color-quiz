import React from 'react';
import { Button } from '@/components/ui/button.tsx';
import useAudio from '@/hooks/useAudio.ts';

const SoundControlButton: React.FC<React.ButtonHTMLAttributes<any>> = (
  props
) => {
  const { isMuted, toggleMute } = useAudio();

  const iconBackground = isMuted
    ? '/assets/icons/sound-icon.svg'
    : '/assets/icons/mute-icon.svg';

  return (
    <Button
      className={props.className}
      variant={'outline'}
      size={'icon'}
      onClick={toggleMute}
    >
      <div
        className={'w-32 h-32'}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        style={{
          background: `url(${iconBackground}) no-repeat 50% 50%`,
        }}
      />
    </Button>
  );
};

export default SoundControlButton;
