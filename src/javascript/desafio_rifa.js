
// Desafio Final: Sistema de Rifas

// 1. Criar rifa
function criarRifa(totalBilhetes) {
    return {
        total: totalBilhetes,
        vendidos: [], // Armazena os números já comprados
        aberta: true
    };
}

// 2. Vender bilhete
function venderBilhete(rifa, numeroBilhete) {
    if (!rifa.aberta) return "Rifa fechada.";

    // Validações
    if (numeroBilhete < 1 || numeroBilhete > rifa.total) {
        console.log(`Erro: Bilhete ${numeroBilhete} inválido.`);
        return false;
    }
    if (rifa.vendidos.includes(numeroBilhete)) {
        console.log(`Erro: Bilhete ${numeroBilhete} já vendido.`);
        return false;
    }

    rifa.vendidos.push(numeroBilhete);
    console.log(`Bilhete ${numeroBilhete} vendido com sucesso!`);
    return true;
}

// 3. Sortear ganhador
function sortearGanhador(rifa) {
    if (rifa.vendidos.length === 0) {
        return "Não há bilhetes vendidos para sortear.";
    }

    // Escolhe um índice aleatório dentro da lista de vendidos
    const indiceAleatorio = Math.floor(Math.random() * rifa.vendidos.length);
    const numeroSorteado = rifa.vendidos[indiceAleatorio];

    return numeroSorteado;
}
