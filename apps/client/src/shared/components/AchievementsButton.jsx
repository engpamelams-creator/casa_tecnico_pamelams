import React, { useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../context/AchievementsContext';

export const AchievementsButton = () => {
    const [showModal, setShowModal] = useState(false);
    const { unlockedAchievements, achievements } = useAchievements();

    const achievementsList = Object.values(achievements);
    const unlockedCount = unlockedAchievements.length;
    const totalCount = achievementsList.length;

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="relative flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors border border-white/5"
            >
                <Trophy size={18} />
                <span className="text-sm hidden sm:inline">{unlockedCount}/{totalCount}</span>
                {unlockedCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {unlockedCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-yellow-500/20 p-6 rounded-2xl w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Trophy className="text-yellow-500" size={24} />
                                    Conquistas
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {achievementsList.map(achievement => {
                                    const isUnlocked = unlockedAchievements.includes(achievement.id);
                                    return (
                                        <div
                                            key={achievement.id}
                                            className={`p-4 rounded-xl border transition-all ${isUnlocked
                                                    ? 'bg-yellow-500/10 border-yellow-500/30'
                                                    : 'bg-zinc-800/50 border-zinc-700/50 opacity-50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">{achievement.icon}</span>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-white">{achievement.title}</h4>
                                                    <p className="text-sm text-zinc-400">{achievement.description}</p>
                                                </div>
                                                {isUnlocked && (
                                                    <span className="text-yellow-500 text-xl">✓</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg text-center">
                                <p className="text-zinc-400 text-sm">
                                    Progresso: <span className="text-yellow-500 font-bold">{unlockedCount}/{totalCount}</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
