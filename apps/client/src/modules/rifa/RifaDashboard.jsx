import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Crown, Sparkles, LayoutDashboard, LogOut, History, Calendar, UserCircle } from 'lucide-react';
import { supabase } from '../../core/supabaseClient';
import { useAudio } from '../../shared/hooks/useAudio';

const DashboardHistory = ({ onClose }) => {
    const [historyItems, setHistoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            // NOTE: Using 'select *' is fine for now, but we should paginate this table if it grows > 1000 items
            const { data, error } = await supabase
                .from('historico_vencedores')
                .select('*')
                .order('data_sorteio', { ascending: false });

            if (error) {
                console.error('Failed to fetch history:', error);
                // Fail silently for UI, just show empty
            }

            setHistoryItems(data || []);
            setIsLoading(false);
        };
        fetchHistory();
    }, []);

    return (
        <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-zinc-900 border-l border-white/10 shadow-2xl z-50 p-6 overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><History className="text-yellow-500" /> Auditoria de Sorteios</h2>
                <button onClick={onClose} className="text-zinc-500 hover:text-white">Fechar</button>
            </div>
            {isLoading ? <p className="text-zinc-500">Sincronizando dados...</p> : (
                <div className="space-y-3">
                    {historyItems.map((record) => (
                        <div key={record.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex justify-between hover:border-white/10 transition-colors">
                            <div>
                                <p className="text-xs text-zinc-500 flex items-center gap-1"><Calendar size={10} /> {new Date(record.data_sorteio).toLocaleDateString()}</p>
                                <p className="text-white font-bold text-lg">Bilhete #{record.numero_sorteado}</p>
                            </div>
                            <div className="text-right"><p className="text-xs text-zinc-500">Prêmio</p><p className="text-yellow-400 font-mono">R$ {record.premio_valor}</p></div>
                        </div>
                    ))}
                    {historyItems.length === 0 && <p className="text-zinc-600 italic">Nenhum sorteio registrado ainda.</p>}
                </div>
            )}
        </motion.div>
    );
};

export default function RifaDashboard({ isAuthenticated, onRequestLogin, onLogout }) {
    const [showAdminPanel, setShowAdminPanel] = useState(false);

    // TODO: Move this config to a database table so the client can change the ticket count dynamically
    const TOTAL_TICKETS = 50;

    const [soldTickets, setSoldTickets] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastWinner, setLastWinner] = useState(null);

    // NOTE: Prize value is currently local state. If two admins edit this, they won't see each other's changes.
    // Future improvement: Sync prize value via Supabase Realtime too.
    const [prizeValue, setPrizeValue] = useState(200);

    const playClickSound = useAudio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    const playWinSound = useAudio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');

    // Realtime Subscription
    useEffect(() => {
        // IMPORTANT: Listening to BOTH INSERT and DELETE events to keep UI in sync without refreshing
        const rifaChannel = supabase.channel('rifa-publica')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bilhetes' }, (payload) => {
                setSoldTickets((current) => [...current, payload.new.numero]);
                playClickSound();
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bilhetes' }, () => {
                // Full reset event
                setSoldTickets([]);
                setLastWinner(null);
            })
            .subscribe();

        // Initial fetch
        supabase.from('bilhetes').select('numero').then(({ data, error }) => {
            if (error) {
                console.error('Initial sync failed:', error);
                return;
            }
            if (data) setSoldTickets(data.map(t => t.numero));
        });

        return () => { supabase.removeChannel(rifaChannel); };
    }, []);

    const purchaseTicket = async (ticketNumber) => {
        // Optimistic UI check (prevent double click)
        if (soldTickets.includes(ticketNumber)) return;

        // DB Insert - Database rules will reject duplicates if race condition occurs
        const { error } = await supabase.from('bilhetes').insert([{ numero: ticketNumber }]);
        if (error) {
            console.warn('Race condition detected or duplicate purchase for ticket:', ticketNumber);
        }
    };

    const resetRaffle = async () => {
        if (!isAuthenticated) return;

        // Hard delete all tickets to start fresh
        // FIXME: We should probably soft-delete or archive this data instead of truncating
        await supabase.from('bilhetes').delete().neq('id', 0);
    };

    const performDraw = async () => {
        if (soldTickets.length === 0) return;

        setIsDrawing(true);

        // Suspense effect
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Secure Random using browser Crypto API (Serverless & Secure)
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const randomIndex = array[0] % soldTickets.length;
        const winnerTicket = soldTickets[randomIndex];

        setLastWinner(winnerTicket);
        setIsDrawing(false);
        playWinSound();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFFFFF'] });

        // Persist winner
        await supabase.from('historico_vencedores').insert([{ numero_sorteado: winnerTicket, premio_valor: prizeValue }]);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">

            {/* Top Navigation */}
            <div className="fixed top-6 right-6 z-40 flex gap-2">
                {isAuthenticated ? (
                    <>
                        <button onClick={() => setShowAdminPanel(true)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/20 rounded-full text-sm transition-colors">
                            <LayoutDashboard size={16} /> Admin
                        </button>
                        <button onClick={onLogout} className="px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-full text-sm flex gap-2 items-center">
                            <LogOut size={16} /> Sair
                        </button>
                    </>
                ) : (
                    <button onClick={onRequestLogin} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-sm transition-colors text-zinc-300">
                        <UserCircle size={16} /> Área Restrita
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isAuthenticated && showAdminPanel && <DashboardHistory onClose={() => setShowAdminPanel(false)} />}
            </AnimatePresence>

            <motion.div className="w-full max-w-5xl bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl relative">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg shadow-yellow-500/20">
                            <Crown className="text-black w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">ROYAL <span className="text-yellow-400">RIFA</span></h1>
                            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-1 font-medium">Enterprise System</p>
                        </div>
                    </div>

                    <div className="flex gap-8 mt-6 md:mt-0 bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="text-right">
                            <p className="text-xs text-zinc-500 uppercase">Potencial de Prêmio</p>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                                    R$ <input type="number" value={prizeValue} onChange={e => setPrizeValue(e.target.value)} className="bg-transparent w-20 focus:outline-none border-b border-yellow-500/50" />
                                </div>
                            ) : (
                                <p className="text-yellow-400 font-bold text-xl">R$ {prizeValue}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-500 uppercase">Disponibilidade</p>
                            <p className="text-xl font-mono font-bold text-white">{soldTickets.length}/{TOTAL_TICKETS}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-10">
                    {Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1).map((num) => {
                        const isTaken = soldTickets.includes(num);
                        return (
                            <button
                                key={num}
                                onClick={() => purchaseTicket(num)}
                                disabled={isTaken || isDrawing}
                                className={`
                  h-14 rounded-lg font-bold text-lg transition-all border relative
                  ${isTaken
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

                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                    {isAuthenticated && lastWinner && (
                        <button onClick={resetRaffle} className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                            <RotateCcw size={18} /> Admin: Resetar Ciclo
                        </button>
                    )}

                    <button
                        onClick={performDraw}
                        disabled={soldTickets.length === 0 || isDrawing}
                        className="px-8 py-3 rounded-xl font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10"
                    >
                        {isDrawing ? 'Sorteando...' : 'Sortear Agora'}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {lastWinner && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                            <h2 className="text-yellow-500 text-2xl font-bold mb-4">VENCEDOR IDENTIFICADO</h2>
                            <div className="text-9xl font-black text-white">{lastWinner}</div>
                            <button onClick={() => setLastWinner(null)} className="mt-8 text-zinc-500 hover:text-white underline">Dispensar Aviso</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
