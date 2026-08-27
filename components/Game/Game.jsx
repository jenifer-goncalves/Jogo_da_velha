import { useState } from 'react';
import Board from "../Board/Board.jsx";

// ==========================================
// COMPONENTE PRINCIPAL: Game (Jogo)
// ==========================================
// Gerencia o estado global, histórico de jogadas e a "viagem no tempo".
export default function Game() {
  // Estado que armazena a lista de jogadas (array de arrays de 9 posições)
  const [history, setHistory] = useState([Array(9).fill(null)]);
  
  // Estado que guarda o índice da jogada atual que o usuário está visualizando
  const [currentMove, setCurrentMove] = useState(0);
  
  // Define se é a vez do 'X' com base no número da jogada atual (se par = X, se ímpar = O)
  const xIsNext = currentMove % 2 === 0;
  
  // Pega o estado do tabuleiro na jogada atual
  const currentSquares = history[currentMove];

  // Função para atualizar o histórico quando uma nova jogada é feita
  function handlePlay(nextSquares) {
    // Mantém o histórico até o ponto atual e adiciona o novo estado do tabuleiro
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    // Atualiza a jogada atual para a mais recente
    setCurrentMove(nextHistory.length - 1);
  }

  // Função para mudar a visualização para uma jogada anterior (Viagem no Tempo)
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Mapeia o histórico para criar uma lista de botões que permitem navegar pelas jogadas
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Jogada ' + move;
    } else {
      description = 'Início do jogo';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      {/* Lado esquerdo: Tabuleiro do jogo */}
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      
      {/* Lado direito: Lista com o histórico de jogadas */}
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}