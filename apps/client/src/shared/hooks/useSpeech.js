import { useCallback } from 'react';

export const useSpeech = () => {
    const speak = useCallback((text, options = {}) => {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech Synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || 'pt-BR';
        utterance.rate = options.rate || 0.9; // Slightly slower for clarity
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        window.speechSynthesis.speak(utterance);
    }, []);

    const announceWinner = useCallback((number, name, prize) => {
        let message = '';

        if (name) {
            message = `Parabéns ${name}! Você ganhou com o número ${number}. Prêmio de ${prize} reais!`;
        } else {
            message = `O número sorteado é ${number}. Prêmio de ${prize} reais!`;
        }

        speak(message, { rate: 0.85 });
    }, [speak]);

    return { speak, announceWinner };
};
