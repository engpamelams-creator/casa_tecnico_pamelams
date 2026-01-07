import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Crown, Sparkles, LayoutDashboard, LogOut, History, Calendar, UserCircle, Settings, X, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
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

const SettingsModal = ({ onClose, ticketCount, setTicketCount, prizeValue, setPrizeValue, unitPrice, setUnitPrice, drawByName, setDrawByName, isAuthenticated }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-900 border border-yellow-500/20 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings className="text-yellow-500" size={20} /> Configuração
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold block mb-2">Quantidade de Números</label>
                        <input
                            type="number"
                            value={ticketCount}
                            onChange={e => setTicketCount(Number(e.target.value))}
                            className="w-full bg-black/50 border border-zinc-700 focus:border-yellow-500 rounded-lg p-3 text-white outline-none font-mono cursor-text"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold block mb-2">Valor do Prêmio (R$)</label>
                        <input
                            type="number"
                            value={prizeValue}
                            onChange={e => setPrizeValue(Number(e.target.value))}
                            className="w-full bg-black/50 border border-zinc-700 focus:border-yellow-500 rounded-lg p-3 text-white outline-none font-mono cursor-text"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-green-400 uppercase font-bold block mb-2">💰 Valor por Número (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={unitPrice}
                            onChange={e => setUnitPrice(Number(e.target.value))}
                            className="w-full bg-black/50 border border-green-700 focus:border-green-500 rounded-lg p-3 text-white outline-none font-mono cursor-text"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs text-purple-400 uppercase font-bold">🎲 Sortear por Nome</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={drawByName}
                                    onChange={e => setDrawByName(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </div>
                        </label>
                        <p className="text-[10px] text-zinc-600 mt-2">Quando ativado, sorteia um nome aleatório ao invés do número</p>
                    </div>
                </div>

                <button onClick={onClose} className="w-full mt-6 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
                    Salvar Alterações
                </button>
            </motion.div>
        </div>
    );
};

const FloatingDiceBackground = () => {
    // Array of dice icons to randomly select from
    const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

    // Generate 25 floating dice with random properties
    const diceElements = Array.from({ length: 25 }).map((_, i) => {
        const RandomDice = DiceIcons[Math.floor(Math.random() * DiceIcons.length)];
        const left = Math.floor(Math.random() * 100) + '%';
        const delay = -(Math.floor(Math.random() * 20)) + 's'; // Negative delay for staggered start
        const duration = Math.floor(Math.random() * 15) + 20 + 's'; // 20-35s duration
        const size = Math.floor(Math.random() * 40) + 30; // 30-70px size
        const opacity = (Math.random() * 0.3 + 0.15).toFixed(2); // 0.15-0.45 opacity

        return (
            <div
                key={i}
                className="absolute text-yellow-500 animate-float"
                style={{
                    left: left,
                    animationDelay: delay,
                    animationDuration: duration,
                    fontSize: size + 'px',
                    opacity: opacity,
                    width: size + 'px',
                    height: size + 'px'
                }}
            >
                <RandomDice size={size} strokeWidth={1.5} />
            </div>
        );
    });

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#09090b] to-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/15 via-transparent to-transparent"></div>
            {diceElements}
        </div>
    );
};

export default function RifaDashboard({ isAuthenticated, onRequestLogin, onLogout }) {
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // State for dynamic configuration (Admin only) - Persisted in LocalStorage
    const [ticketCount, setTicketCount] = useState(() => {
        const saved = localStorage.getItem('royal_rifa_ticketCount');
        return saved ? Number(saved) : 50;
    });
    const [prizeValue, setPrizeValue] = useState(() => {
        const saved = localStorage.getItem('royal_rifa_prizeValue');
        return saved ? Number(saved) : 200;
    });
    const [unitPrice, setUnitPrice] = useState(() => {
        const saved = localStorage.getItem('royal_rifa_unitPrice');
        return saved ? Number(saved) : 10;
    });
    const [drawByName, setDrawByName] = useState(() => {
        const saved = localStorage.getItem('royal_rifa_drawByName');
        return saved === 'true';
    });

    // Save config changes
    useEffect(() => {
        localStorage.setItem('royal_rifa_ticketCount', ticketCount);
        localStorage.setItem('royal_rifa_prizeValue', prizeValue);
        localStorage.setItem('royal_rifa_unitPrice', unitPrice);
        localStorage.setItem('royal_rifa_drawByName', drawByName);
    }, [ticketCount, prizeValue, unitPrice, drawByName]);

    const [soldTickets, setSoldTickets] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastWinner, setLastWinner] = useState(null);

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
            if (data) setSoldTickets(data.map(t => t.numero));
        });

        return () => { supabase.removeChannel(rifaChannel); };
    }, []);

    const purchaseTicket = async (ticketNumber) => {
        if (soldTickets.includes(ticketNumber)) return;
        const { error } = await supabase.from('bilhetes').insert([{ numero: ticketNumber }]);
    };

    const resetRaffle = async () => {
        if (!window.confirm("⚠️ TEM CERTEZA QUE DESEJA LIMPAR O SORTEIO?\n\nIsso apagará todos os bilhetes vendidos e preparará o sistema para uma nova rodada.")) {
            return;
        }

        // Limpa o estado local imediatamente
        setSoldTickets([]);
        setLastWinner(null);

        // Deleta do banco de dados
        await supabase.from('bilhetes').delete().neq('id', 0);
    };

    const performDraw = async () => {
        if (soldTickets.length === 0) return;

        setIsDrawing(true);

        await new Promise(resolve => setTimeout(resolve, 3000));

        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const randomIndex = array[0] % soldTickets.length;
        const winnerTicket = soldTickets[randomIndex];

        // Gera nome aleatório se o modo estiver ativado
        let winnerName = null;
        if (drawByName) {
            const firstNames = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Julia', 'Lucas', 'Maria', 'Nicolas', 'Olivia', 'Pedro', 'Rafaela', 'Samuel', 'Tatiana', 'Vitor', 'Yasmin'];
            const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Ribeiro', 'Alves', 'Pereira', 'Monteiro'];

            const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            winnerName = `${randomFirstName} ${randomLastName}`;
        }

        setLastWinner({ number: winnerTicket, name: winnerName, prize: prizeValue });
        setIsDrawing(false);
        playWinSound();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFFFFF'] });

        await supabase.from('historico_vencedores').insert([{ numero_sorteado: winnerTicket, premio_valor: prizeValue }]);
    };

    return (
        <div className="min-h-screen text-white p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">
            <FloatingDiceBackground />

            {/* Version Indicator */}
            <div className="fixed bottom-2 right-2 text-[10px] text-zinc-800 font-mono z-50">v2.2 (Rifa Real)</div>

            {/* Top Navigation */}
            <div className="fixed top-6 right-6 z-40 flex gap-2">
                {/* Settings Button - Always Visible (Hybrid Mode) */}
                <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors border border-white/5">
                    <Settings size={18} />
                </button>

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
                {showSettings && (
                    <SettingsModal
                        onClose={() => setShowSettings(false)}
                        ticketCount={ticketCount} setTicketCount={setTicketCount}
                        prizeValue={prizeValue} setPrizeValue={setPrizeValue}
                        unitPrice={unitPrice} setUnitPrice={setUnitPrice}
                        drawByName={drawByName} setDrawByName={setDrawByName}
                        isAuthenticated={isAuthenticated}
                    />
                )}
            </AnimatePresence>

            <motion.div className="w-full max-w-5xl bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg shadow-yellow-500/20">
                            <Crown className="text-black w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">ROYAL <span className="text-yellow-400">RIFA</span></h1>
                            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-1 font-medium">SISTEMA ABERTO</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-6 md:mt-0 items-end justify-end">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-right w-32">
                            <p className="text-xs text-zinc-500 uppercase mb-1">NUMERAÇÃO</p>
                            <p className="text-xl font-mono font-bold text-white">1 - {ticketCount}</p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-right">
                            <p className="text-xs text-zinc-500 uppercase mb-1">PRÊMIO ATUAL</p>
                            <p className="text-yellow-400 font-bold text-xl">R$ {prizeValue}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-xl border border-green-500/30 text-right">
                            <p className="text-xs text-green-400 uppercase mb-1 font-bold">🎫 VALOR/NÚMERO</p>
                            <p className="text-green-400 font-bold text-xl">R$ {unitPrice.toFixed(2)}</p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-right">
                            <p className="text-xs text-zinc-500 uppercase mb-1">BILHETES</p>
                            <p className="text-xl font-mono font-bold text-white">{soldTickets.length}/{ticketCount}</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 p-4 rounded-xl border border-orange-500/30 text-right">
                            <p className="text-xs text-orange-400 uppercase mb-1 font-bold">💰 ARRECADADO</p>
                            <p className="text-orange-400 font-bold text-xl">R$ {(soldTickets.length * unitPrice).toFixed(2)}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-10">
                    {Array.from({ length: ticketCount }, (_, i) => i + 1).map((num) => {
                        const isTaken = soldTickets.includes(num);
                        return (
                            <button
                                key={num}
                                onClick={() => purchaseTicket(num)}
                                disabled={isTaken || isDrawing}
                                className={`
                  h-16 rounded-lg font-bold transition-all border relative flex flex-col items-center justify-center gap-0.5
                  ${isTaken
                                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400 cursor-not-allowed shadow-lg shadow-orange-500/20'
                                        : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-yellow-500 hover:text-yellow-400'
                                    }
                `}
                            >
                                <span className="text-lg">{num}</span>
                                <span className={`text-[10px] font-semibold ${isTaken ? 'text-white/80' : 'text-green-400'}`}>
                                    R$ {unitPrice.toFixed(2)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center gap-3 pt-6 border-t border-white/5">
                    <button onClick={resetRaffle} className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                        <RotateCcw size={18} /> Reiniciar Tudo
                    </button>

                    <button
                        onClick={performDraw}
                        disabled={soldTickets.length === 0 || isDrawing}
                        className="px-8 py-3 rounded-xl font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDrawing ? 'Sorteando...' : 'Sortear Agora'}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {lastWinner && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center max-w-2xl">
                            <h2 className="text-yellow-500 text-3xl font-bold mb-6">🏆 VENCEDOR IDENTIFICADO</h2>

                            {lastWinner.name && (
                                <div className="mb-4">
                                    <p className="text-purple-400 text-sm uppercase font-bold mb-2">Nome do Ganhador</p>
                                    <p className="text-5xl font-bold text-white mb-6">{lastWinner.name}</p>
                                </div>
                            )}

                            <div className="mb-4">
                                <p className="text-zinc-500 text-sm uppercase font-bold mb-2">Número Sorteado</p>
                                <div className="text-9xl font-black text-white">{lastWinner.number}</div>
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50 rounded-2xl">
                                <p className="text-yellow-400 text-sm uppercase font-bold mb-2">💰 Prêmio Total</p>
                                <p className="text-6xl font-black text-yellow-400">R$ {lastWinner.prize.toFixed(2)}</p>
                            </div>

                            <button
                                onClick={() => setLastWinner(null)}
                                className="mt-8 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
