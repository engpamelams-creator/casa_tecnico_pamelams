import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Dna, RotateCcw, Coins, Crown, Sparkles, Share2, Dice5, Dice3, Copy } from 'lucide-react';

// --- Componente de Fundo Animado (Dados Flutuantes) ---
const BackgroundDice = () => {
  // Cria 15 elementos flutuantes aleatórios
  const floatingElements = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Posição inicial X
    y: Math.random() * 100, // Posição inicial Y
    duration: Math.random() * 20 + 10, // Duração lenta (10s a 30s)
    scale: Math.random() * 0.5 + 0.5, // Tamanho variado
    Icon: i % 2 === 0 ? Dice5 : Dice3 // Alterna entre dados
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Camada de Névoa Dourada */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

      {floatingElements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ x: `${el.x}vw`, y: `${el.y}vh`, opacity: 0 }}
          animate={{
            x: [`${el.x}vw`, `${(el.x + 50) % 100}vw`, `${el.x}vw`], // Move de um lado pro outro
            y: [`${el.y}vh`, `${(el.y + 50) % 100}vh`, `${el.y}vh`], // Move cima/baixo
            rotate: [0, 360], // Gira
            opacity: [0.1, 0.3, 0.1] // Pisca suavemente
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-yellow-600/20"
          style={{ scale: el.scale }}
        >
          <el.Icon size={64} />
        </motion.div>
      ))}
    </div>
  );
};

// --- Componente Principal ---
export default function RifaCasinoSocial() {
  const TOTAL_BILHETES = 50;
  const [bilhetesVendidos, setBilhetesVendidos] = useState([]);
  const [ultimoGanhador, setUltimoGanhador] = useState(null);
  const [isSorteando, setIsSorteando] = useState(false);

  // Função para compartilhar
  const shareResult = (platform) => {
    const text = `Acabei de ganhar no Sorteio Royal com o número ${ultimoGanhador}! 🏆 Venha participar!`;
    const url = "https://meu-projeto-rifa.com"; // Seu link aqui

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      // Instagram/TikTok não permitem share direto de texto via web, copiamos para o clipboard
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Texto copiado! Cole no seu Instagram ou TikTok.");
    }
  };

  const triggerLuxuryWin = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#FFFFFF'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FFD700', '#FFFFFF'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleToggleBilhete = (numero) => {
    if (ultimoGanhador || isSorteando) return;
    if (bilhetesVendidos.includes(numero)) {
      setBilhetesVendidos(prev => prev.filter(n => n !== numero));
    } else {
      setBilhetesVendidos(prev => [...prev, numero]);
    }
  };

  const handleSortear = async () => {
    if (bilhetesVendidos.length === 0) return;
    setIsSorteando(true);
    setUltimoGanhador(null);
    await new Promise(resolve => setTimeout(resolve, 2500));
    const ganhador = bilhetesVendidos[Math.floor(Math.random() * bilhetesVendidos.length)];
    setUltimoGanhador(ganhador);
    setIsSorteando(false);
    triggerLuxuryWin();
  };

  const resetar = () => {
    setBilhetesVendidos([]);
    setUltimoGanhador(null);
    setIsSorteando(false);
  };

  return (
    <div className="min-h-screen text-white p-6 flex flex-col items-center justify-center relative overflow-hidden font-sans">

      {/* 1. O Fundo Animado (Novo!) */}
      <BackgroundDice />

      {/* Container Principal (Glassmorphism) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              <Crown className="text-black w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">ROYAL <span className="text-yellow-400">RIFA</span></h1>
              <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Sorteio Premium</p>
            </div>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <StatsDisplay label="Apostas" value={bilhetesVendidos.length} icon={<Dna size={14} />} />
            <StatsDisplay label="Prêmio" value={`R$ ${bilhetesVendidos.length * 50}`} icon={<Coins size={14} />} isGold />
          </div>
        </header>

        {/* Grade de Números */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-8">
          {Array.from({ length: TOTAL_BILHETES }, (_, i) => i + 1).map((num) => {
            const isSelected = bilhetesVendidos.includes(num);
            const isWinner = ultimoGanhador === num;
            return (
              <motion.button
                key={num}
                onClick={() => handleToggleBilhete(num)}
                disabled={isSorteando || ultimoGanhador}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`h-12 rounded-lg font-bold transition-all border ${isWinner ? 'bg-yellow-500 text-black border-yellow-300 shadow-[0_0_20px_#eab308]' :
                  isSelected ? 'bg-yellow-900/80 text-white border-yellow-600' :
                    'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'
                  }`}
              >
                {num}
              </motion.button>
            );
          })}
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <span className="text-gray-500 text-sm hidden sm:block">Selecione os números para apostar</span>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            {ultimoGanhador && (
              <button onClick={resetar} className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white flex gap-2">
                <RotateCcw size={18} /> Reiniciar
              </button>
            )}
            <button
              onClick={handleSortear}
              disabled={bilhetesVendidos.length === 0 || isSorteando || ultimoGanhador}
              className={`px-8 py-3 rounded-xl font-bold text-black flex gap-2 shadow-lg transition-all ${bilhetesVendidos.length === 0 ? 'bg-gray-700 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105'
                }`}
            >
              {isSorteando ? <span key="spin"><Sparkles className="animate-spin" /></span> : <span key="trophy"><Trophy /></span>}
              {isSorteando ? <span key="text-sq">SORTEANDO...</span> : <span key="text-sr">SORTEAR AGORA</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal de Vitória com Redes Sociais */}
      <AnimatePresence>
        {ultimoGanhador && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border border-yellow-500/30 p-8 rounded-3xl text-center max-w-md w-full relative"
            >
              <div className="inline-block p-4 rounded-full bg-yellow-500/20 mb-4 text-yellow-500 animate-bounce">
                <Trophy size={48} />
              </div>
              <h2 className="text-gray-400 uppercase tracking-widest text-sm">Vencedor</h2>
              <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-6">
                {ultimoGanhador}
              </div>

              {/* Botões de Social Media */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-3 flex items-center justify-center gap-2">
                  <Share2 size={14} /> Compartilhar Resultado
                </p>
                <div className="flex justify-center gap-4">
                  <SocialButton color="bg-green-600" label="WhatsApp" onClick={() => shareResult('whatsapp')} />
                  <SocialButton color="bg-blue-600" label="Facebook" onClick={() => shareResult('facebook')} />
                  <SocialButton color="bg-pink-600" label="Insta/TikTok" onClick={() => shareResult('copy')} icon={<Copy size={16} />} />
                </div>
              </div>

              <button onClick={() => setUltimoGanhador(null)} className="text-yellow-500 text-sm font-bold hover:underline">
                FECHAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componentes Auxiliares
const StatsDisplay = ({ label, value, icon, isGold }) => (
  <div className="text-right">
    <div className="flex items-center justify-end gap-1 text-xs text-gray-500 uppercase">{label} {icon}</div>
    <div className={`text-xl font-bold ${isGold ? 'text-yellow-400' : 'text-white'}`}>{value}</div>
  </div>
);

const SocialButton = ({ color, label, onClick, icon }) => (
  <button onClick={onClick} className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`} title={label}>
    {icon || label[0]}
  </button>
);
