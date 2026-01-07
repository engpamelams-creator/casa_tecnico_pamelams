import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from './supabaseClient'; // Importe seu cliente aqui
import { Trophy, RotateCcw, Crown, Sparkles, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';

// ... (Mantenha o hook useAudio e componentes StatBox igual ao anterior) ...
const useAudio = (url) => {
  const audio = useRef(new Audio(url));
  const play = () => { audio.current.currentTime = 0; audio.current.play().catch(e => { }); };
  return play;
};

export default function RifaSupabaseRealtime() {
  const TOTAL_BILHETES = 50;

  // Estados
  const [bilhetesVendidos, setBilhetesVendidos] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // Status da conexão
  const [isSorteando, setIsSorteando] = useState(false);
  const [ultimoGanhador, setUltimoGanhador] = useState(null);

  // Sons
  const playClick = useAudio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  const playWin = useAudio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');

  // --- 1. CARREGAMENTO INICIAL E REALTIME (A Mágica) ---
  useEffect(() => {
    // A. Busca dados iniciais do banco
    const fetchBilhetes = async () => {
      const { data, error } = await supabase.from('bilhetes').select('numero');
      if (!error && data) {
        setBilhetesVendidos(data.map(b => b.numero));
        setIsConnected(true);
      }
    };

    fetchBilhetes();

    // B. Abre o "Canal de Escuta" (Websocket)
    const channel = supabase
      .channel('rifa-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bilhetes' }, (payload) => {
        // Quando ALGUÉM (qualquer lugar do mundo) comprar, atualiza aqui:
        setBilhetesVendidos((prev) => [...prev, payload.new.numero]);
        playClick(); // Toca som quando alguém compra
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bilhetes' }, (payload) => {
        // Se reiniciar a rifa
        setBilhetesVendidos((prev) => prev.filter(n => n !== payload.old.numero));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsConnected(true);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- 2. Lógica de Venda (Envia pro Banco) ---
  const handleToggleBilhete = async (numero) => {
    if (isSorteando) return;

    if (bilhetesVendidos.includes(numero)) {
      alert("Este bilhete já foi comprado por outro jogador!");
      return;
    }

    // Tenta inserir no Supabase
    // O banco vai garantir que não haja duplicidade (Constraint UNIQUE)
    const { error } = await supabase
      .from('bilhetes')
      .insert([{ numero: numero }]);

    if (error) {
      alert("Erro ao comprar: Talvez alguém tenha clicado antes de você!");
    } else {
      // Não precisamos fazer setBilhetesVendidos aqui
      // O Realtime (useEffect) vai receber o aviso e atualizar a tela!
    }
  };

  // --- 3. Lógica de Reset (Limpa o Banco) ---
  const resetar = async () => {
    const { error } = await supabase.from('bilhetes').delete().neq('id', 0); // Deleta tudo
    if (!error) {
      setUltimoGanhador(null);
      // O Realtime vai limpar a tela automaticamente
    }
  };

  const handleSortear = async () => {
    if (bilhetesVendidos.length === 0) return;
    setIsSorteando(true);

    // Suspense
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Sorteio Local (Para demonstração visual)
    // Num cenário 100% Sênior, isso seria uma Edge Function no Supabase
    const ganhador = bilhetesVendidos[Math.floor(Math.random() * bilhetesVendidos.length)];

    setUltimoGanhador(ganhador);
    setIsSorteando(false);
    playWin();
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFFFFF'] });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 flex flex-col items-center justify-center font-sans selection:bg-yellow-500 selection:text-black">

      {/* Indicador de Conexão Realtime */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
        {isConnected ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-red-500" />}
        <span className="text-xs font-mono text-zinc-400">{isConnected ? 'LIVE SYNC' : 'OFFLINE'}</span>
      </div>

      <motion.div className="w-full max-w-5xl bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl relative">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg shadow-yellow-500/20">
              <Crown className="text-black w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">SUPABASE <span className="text-yellow-400">MULTIPLAYER</span></h1>
              <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-1 font-medium">PostgreSQL Realtime Rifa</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Bilhetes Vendidos</p>
            <p className="text-2xl font-mono font-bold text-yellow-400">{bilhetesVendidos.length} / {TOTAL_BILHETES}</p>
          </div>
        </header>

        {/* Grid de Bilhetes */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-10">
          {Array.from({ length: TOTAL_BILHETES }, (_, i) => i + 1).map((num) => {
            const isSelected = bilhetesVendidos.includes(num);
            const isWinner = ultimoGanhador === num;

            return (
              <motion.button
                key={num}
                onClick={() => handleToggleBilhete(num)}
                disabled={isSorteando || isSelected || ultimoGanhador}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  h-14 rounded-lg font-bold text-lg transition-all border relative overflow-hidden group
                  ${isWinner
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] z-10 scale-110'
                    : isSelected
                      ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed opacity-60' // Estilo de "Já comprado"
                      : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-yellow-500/50 hover:text-yellow-100 hover:bg-yellow-900/20'
                  }
                `}
              >
                {num}
                {isSelected && !isWinner && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black rotate-[-15deg]">Vendido</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <div className="flex gap-2 items-center text-xs text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Database Connected
          </div>

          <div className="flex gap-3">
            {ultimoGanhador && (
              <button onClick={resetar} className="px-6 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white flex items-center gap-2">
                <RotateCcw size={18} /> Resetar Banco
              </button>
            )}
            <button
              onClick={handleSortear}
              disabled={bilhetesVendidos.length === 0 || isSorteando}
              className="px-8 py-3 rounded-xl font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10"
            >
              {isSorteando ? 'Sorteando...' : 'Sortear Agora'}
            </button>
          </div>
        </div>

      </motion.div>

      {/* Modal de Vitória */}
      <AnimatePresence>
        {ultimoGanhador && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
              <h2 className="text-yellow-500 text-2xl font-bold mb-4">VENCEDOR</h2>
              <div className="text-9xl font-black text-white">{ultimoGanhador}</div>
              <button onClick={() => setUltimoGanhador(null)} className="mt-8 text-zinc-500 hover:text-white underline">Fechar</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
