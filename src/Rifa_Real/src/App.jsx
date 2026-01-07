import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from './supabaseClient';
import { Trophy, RotateCcw, Crown, Sparkles, LayoutDashboard, LogIn, LogOut, History, Calendar, Lock, ArrowLeft, UserCircle } from 'lucide-react';

// --- Hook de Som ---
const useAudio = (url) => {
  const audio = useRef(new Audio(url));
  const play = () => { audio.current.currentTime = 0; audio.current.play().catch(() => { }); };
  return play;
};

// --- TELA DE LOGIN (Agora com botão VOLTAR) ---
const LoginScreen = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('ronaldo@teachlead.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage("Credenciais inválidas.");
      setLoading(false);
    } else {
      onLogin(true); // Sucesso
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-4">
      {/* Fundo Animado */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 animate-spin-slow"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900/90 backdrop-blur-xl border border-yellow-500/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10"
      >
        <button onClick={onBack} className="absolute top-4 left-4 text-zinc-500 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Voltar para Rifa
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="inline-block p-4 bg-yellow-500 rounded-full mb-4 shadow-lg">
            <Lock className="text-black w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Área <span className="text-yellow-400">Restrita</span></h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-zinc-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
            placeholder="E-mail"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-zinc-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
            placeholder="Senha"
          />

          {errorMessage && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{errorMessage}</p>}

          <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform">
            {loading ? 'Verificando...' : 'ACESSAR SISTEMA'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- COMPONENTE DO DASHBOARD (Histórico VIP) ---
const DashboardHistory = ({ onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase.from('historico_vencedores').select('*').order('data_sorteio', { ascending: false });
      setHistory(data || []);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-zinc-900 border-l border-white/10 shadow-2xl z-50 p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><History className="text-yellow-500" /> Histórico</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">Fechar</button>
      </div>
      {loading ? <p className="text-zinc-500">Carregando...</p> : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex justify-between">
              <div>
                <p className="text-xs text-zinc-500 flex items-center gap-1"><Calendar size={10} /> {new Date(item.data_sorteio).toLocaleDateString()}</p>
                <p className="text-white font-bold text-lg">Vencedor #{item.numero_sorteado}</p>
              </div>
              <div className="text-right"><p className="text-xs text-zinc-500">Prêmio</p><p className="text-yellow-400 font-mono">R$ {item.premio_valor}</p></div>
            </div>
          ))}
          {history.length === 0 && <p className="text-zinc-600">Sem histórico.</p>}
        </div>
      )}
    </motion.div>
  );
};

// --- APP PRINCIPAL ---
export default function RifaSystemHybrid() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Controla se o modal de login aparece
  const [showDashboard, setShowDashboard] = useState(false);

  // Rifa States
  const TOTAL_BILHETES = 50;
  const [bilhetesVendidos, setBilhetesVendidos] = useState([]);
  const [isSorteando, setIsSorteando] = useState(false);
  const [ultimoGanhador, setUltimoGanhador] = useState(null);
  const [prizeValue, setPrizeValue] = useState(200);

  const playClick = useAudio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  const playWin = useAudio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');

  // Realtime
  useEffect(() => {
    const channel = supabase.channel('rifa-publica')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bilhetes' }, (payload) => {
        setBilhetesVendidos((prev) => [...prev, payload.new.numero]);
        playClick();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bilhetes' }, () => {
        setBilhetesVendidos([]);
        setUltimoGanhador(null);
      })
      .subscribe();

    supabase.from('bilhetes').select('numero').then(({ data }) => {
      if (data) setBilhetesVendidos(data.map(b => b.numero));
    });

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleToggleBilhete = async (numero) => {
    if (bilhetesVendidos.includes(numero)) return;
    await supabase.from('bilhetes').insert([{ numero: numero }]);
  };

  const resetar = async () => {
    // PROTEÇÃO EXTRA: Só reseta se estiver logado
    if (!isAuthenticated) return;
    await supabase.from('bilhetes').delete().neq('id', 0);
  };

  const handleSortear = async () => {
    if (bilhetesVendidos.length === 0) return;
    setIsSorteando(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const ganhador = bilhetesVendidos[Math.floor(Math.random() * bilhetesVendidos.length)];

    setUltimoGanhador(ganhador);
    setIsSorteando(false);
    playWin();
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFFFFF'] });

    // Salva histórico (qualquer um pode sortear no demo, mas o log fica salvo)
    await supabase.from('historico_vencedores').insert([{ numero_sorteado: ganhador, premio_valor: prizeValue }]);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">

      {/* MENU SUPERIOR (A Mágica acontece aqui) */}
      <div className="fixed top-6 right-6 z-40 flex gap-2">
        {isAuthenticated ? (
          <>
            {/* Botões VIP (Só aparecem se logado) */}
            <button onClick={() => setShowDashboard(true)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/20 rounded-full text-sm transition-colors">
              <LayoutDashboard size={16} /> Admin
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-full text-sm flex gap-2 items-center">
              <LogOut size={16} /> Sair
            </button>
          </>
        ) : (
          /* Botão Público de Login */
          <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-sm transition-colors text-zinc-300">
            <UserCircle size={16} /> Área Restrita
          </button>
        )}
      </div>

      {/* MODAL DE LOGIN (Sobreposto) */}
      {showLoginModal && (
        <LoginScreen
          onLogin={(success) => {
            setIsAuthenticated(success);
            setShowLoginModal(false);
          }}
          onBack={() => setShowLoginModal(false)}
        />
      )}

      {/* DASHBOARD SLIDE-OVER */}
      <AnimatePresence>
        {isAuthenticated && showDashboard && <DashboardHistory onClose={() => setShowDashboard(false)} />}
      </AnimatePresence>

      <motion.div className="w-full max-w-5xl bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl relative">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg shadow-yellow-500/20">
              <Crown className="text-black w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">ROYAL <span className="text-yellow-400">RIFA</span></h1>
              <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-1 font-medium">Sistema Aberto</p>
            </div>
          </div>

          <div className="flex gap-8 mt-6 md:mt-0 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase">Prêmio Atual</p>
              {/* Se for Admin, pode editar o valor. Se for público, só vê. */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                  R$ <input type="number" value={prizeValue} onChange={e => setPrizeValue(e.target.value)} className="bg-transparent w-20 focus:outline-none border-b border-yellow-500/50" />
                </div>
              ) : (
                <p className="text-yellow-400 font-bold text-xl">R$ {prizeValue}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase">Bilhetes</p>
              <p className="text-xl font-mono font-bold text-white">{bilhetesVendidos.length}/{TOTAL_BILHETES}</p>
            </div>
          </div>
        </header>

        {/* Grid de Bilhetes */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-10">
          {Array.from({ length: TOTAL_BILHETES }, (_, i) => i + 1).map((num) => {
            const isSelected = bilhetesVendidos.includes(num);
            return (
              <button
                key={num}
                onClick={() => handleToggleBilhete(num)}
                disabled={isSelected || isSorteando}
                className={`
                  h-14 rounded-lg font-bold text-lg transition-all border relative
                  ${isSelected
                    ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                    : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-yellow-500 hover:text-yellow-400'
                  }
                `}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
          {/* BOTÃO RESETAR (Só para Admin) */}
          {isAuthenticated && ultimoGanhador && (
            <button onClick={resetar} className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-2">
              <RotateCcw size={18} /> Admin: Resetar
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
      </motion.div>

      {/* Modal Vitória */}
      <AnimatePresence>
        {ultimoGanhador && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-md">
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
