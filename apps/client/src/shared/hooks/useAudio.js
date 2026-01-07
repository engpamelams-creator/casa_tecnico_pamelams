import { useRef } from 'react';

export const useAudio = (url) => {
    const audio = useRef(new Audio(url));
    const play = () => {
        audio.current.currentTime = 0;
        audio.current.play().catch(() => { });
    };
    return play;
};
