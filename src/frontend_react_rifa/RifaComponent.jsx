import React, { useState } from 'react';

// Simulação do Exercício 3: Sistema de Rifas em React
export default function RifaComponent() {
    const [totalBilhetes] = useState(100);
    const [bilhetesVendidos, setBilhetesVendidos] = useState([]);
    const [ultimoGanhador, setUltimoGanhador] = useState(null);
    const [numeroInput, setNumeroInput] = useState('');

    // Função Vender Bilhete
    const handleVender = () => {
        const numero = parseInt(numeroInput);

        if (!numero || numero < 1 || numero > totalBilhetes) {
            alert(`Número inválido! Escolha entre 1 e ${totalBilhetes}`);
            return;
        }
        if (bilhetesVendidos.includes(numero)) {
            alert("Este bilhete já foi vendido!");
            return;
        }

        setBilhetesVendidos([...bilhetesVendidos, numero]);
        setNumeroInput('');
    };

    // Função Sortear Ganhador
    const handleSortear = () => {
        if (bilhetesVendidos.length === 0) {
            alert("Não há bilhetes vendidos para sortear!");
            return;
        }
        const indiceAleatorio = Math.floor(Math.random() * bilhetesVendidos.length);
        setUltimoGanhador(bilhetesVendidos[indiceAleatorio]);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-xl font-bold text-center text-purple-600">Sistema de Rifa Digital</h1>

            <div className="flex gap-2">
                <input
                    type="number"
                    value={numeroInput}
                    onChange={(e) => setNumeroInput(e.target.value)}
                    placeholder="Nº Bilhete"
                    className="border p-2 rounded w-full"
                />
                <button onClick={handleVender} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Vender
                </button>
            </div>

            <button onClick={handleSortear} className="bg-green-500 text-white w-full py-2 rounded font-bold">
                SORTEAR GANHADOR 🎲
            </button>

            {ultimoGanhador && (
                <div className="p-4 bg-yellow-100 text-yellow-700 font-bold text-center rounded">
                    🎉 Vencedor: {ultimoGanhador}
                </div>
            )}

            <div className="text-xs text-gray-500">
                Vendidos: {bilhetesVendidos.join(', ')}
            </div>
        </div>
    );
}
