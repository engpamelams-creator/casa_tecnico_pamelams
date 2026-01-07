import React, { useState } from 'react';

// O SEU CÓDIGO DA RIFA AQUI
function RifaComponent() {
  const [totalBilhetes] = useState(100);
  const [bilhetesVendidos, setBilhetesVendidos] = useState([]);
  const [ultimoGanhador, setUltimoGanhador] = useState(null);
  const [numeroInput, setNumeroInput] = useState('');

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

  const handleSortear = () => {
    if (bilhetesVendidos.length === 0) {
      alert("Não há bilhetes vendidos para sortear!");
      return;
    }
    const indiceAleatorio = Math.floor(Math.random() * bilhetesVendidos.length);
    setUltimoGanhador(bilhetesVendidos[indiceAleatorio]);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10 border border-gray-200">
      <h1 className="text-2xl font-bold text-center text-purple-700">Sistema de Rifa 🎲</h1>

      <div className="flex gap-2">
        <input
          type="number"
          value={numeroInput}
          onChange={(e) => setNumeroInput(e.target.value)}
          placeholder="Nº Bilhete (1-100)"
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button onClick={handleVender} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
          Vender
        </button>
      </div>

      <button onClick={handleSortear} className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded font-bold text-lg shadow-sm transition-colors">
        SORTEAR VENCEDOR
      </button>

      {ultimoGanhador && (
        <div className="p-6 bg-yellow-50 border-2 border-yellow-400 text-yellow-800 font-bold text-center rounded-lg text-xl animate-bounce">
          🏆 Vencedor: {ultimoGanhador}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-2">Bilhetes Vendidos ({bilhetesVendidos.length}):</p>
        <div className="flex flex-wrap gap-1">
          {bilhetesVendidos.map(n => (
            <span key={n} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// O App principal que renderiza a Rifa
function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <RifaComponent />
    </div>
  )
}

export default App
