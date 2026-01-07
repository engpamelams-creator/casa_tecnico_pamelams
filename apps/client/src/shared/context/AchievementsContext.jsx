import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const AchievementsContext = createContext();

export const achievements = {
    firstWin: {
        id: 'firstWin',
        title: '🥇 Primeiro Vencedor',
        description: 'Ganhou sua primeira rifa',
        icon: '🏆'
    },
    perfectSale: {
        id: 'perfectSale',
        title: '🎯 Perfeccionista',
        description: 'Vendeu 100% dos bilhetes',
        icon: '💯'
    },
    millionaire: {
        id: 'millionaire',
        title: '💰 Milionário',
        description: 'Arrecadou R$ 1.000 ou mais',
        icon: '💎'
    },
    speedster: {
        id: 'speedster',
        title: '⚡ Relâmpago',
        description: 'Vendeu 10 bilhetes em menos de 1 minuto',
        icon: '🚀'
    },
    lucky: {
        id: 'lucky',
        title: '🍀 Sortudo',
        description: 'Realizou 5 sorteios',
        icon: '🎲'
    }
};

export const AchievementsProvider = ({ children }) => {
    const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
        const saved = localStorage.getItem('royal_rifa_achievements');
        return saved ? JSON.parse(saved) : [];
    });

    const [stats, setStats] = useState(() => {
        const saved = localStorage.getItem('royal_rifa_stats');
        return saved ? JSON.parse(saved) : {
            totalDraws: 0,
            totalRevenue: 0,
            totalTicketsSold: 0,
            fastestSaleTime: null
        };
    });

    useEffect(() => {
        localStorage.setItem('royal_rifa_achievements', JSON.stringify(unlockedAchievements));
        localStorage.setItem('royal_rifa_stats', JSON.stringify(stats));
    }, [unlockedAchievements, stats]);

    const unlockAchievement = useCallback((achievementId) => {
        if (unlockedAchievements.includes(achievementId)) return;

        const achievement = achievements[achievementId];
        setUnlockedAchievements(prev => [...prev, achievementId]);

        // Show toast notification
        toast.success(
            <div>
                <div className="font-bold">{achievement.icon} Conquista Desbloqueada!</div>
                <div className="text-sm">{achievement.title}</div>
            </div>,
            { duration: 4000, position: 'top-center' }
        );
    }, [unlockedAchievements]);

    const updateStats = useCallback((updates) => {
        setStats(prev => {
            const newStats = { ...prev, ...updates };

            // Check achievements
            if (newStats.totalDraws === 1) {
                unlockAchievement('firstWin');
            }
            if (newStats.totalDraws >= 5) {
                unlockAchievement('lucky');
            }
            if (newStats.totalRevenue >= 1000) {
                unlockAchievement('millionaire');
            }

            return newStats;
        });
    }, [unlockAchievement]);

    const checkPerfectSale = useCallback((sold, total) => {
        if (sold === total && total > 0) {
            unlockAchievement('perfectSale');
        }
    }, [unlockAchievement]);

    return (
        <AchievementsContext.Provider value={{
            unlockedAchievements,
            achievements,
            stats,
            unlockAchievement,
            updateStats,
            checkPerfectSale
        }}>
            {children}
        </AchievementsContext.Provider>
    );
};

export const useAchievements = () => {
    const context = useContext(AchievementsContext);
    if (!context) {
        throw new Error('useAchievements must be used within AchievementsProvider');
    }
    return context;
};
