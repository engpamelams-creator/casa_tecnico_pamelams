import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../core/supabaseClient';

export const LoginScreen = ({ onLogin, onBack }) => {
    // TODO: Move these hardcoded credentials to Supabase Auth Policies entirely or env vars for dev
    const [email, setEmail] = useState('ronaldo@teachlead.com');
    const [password, setPassword] = useState('');

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setAuthError(null);

        // FIXME: Add rate limiting here to prevent brute force on this endpoint
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Map Supabase error to user friendly message
                if (error.message === 'Invalid login credentials') {
                    throw new Error('Credenciais incorretas. Tente novamente.');
                }
                throw error;
            }

            onLogin(true);

        } catch (err) {
            console.warn('Login attempt failed:', err.message);
            setAuthError(err.message || 'Falha ao conectar com o serviço de autenticação.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-4">
            {/* Background noise effect */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 animate-spin-slow"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900/90 backdrop-blur-xl border border-yellow-500/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10"
            >
                <button onClick={onBack} className="absolute top-4 left-4 text-zinc-500 hover:text-white flex items-center gap-1 text-sm">
                    <ArrowLeft size={16} /> Voltar
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
                        placeholder="E-mail Corporativo"
                    />
                    <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-zinc-700 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                        placeholder="Senha de Acesso"
                    />

                    {authError && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{authError}</p>}

                    <button disabled={isAuthenticating} className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                        {isAuthenticating ? 'Validando Credenciais...' : 'ACESSAR DASHBOARD'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
