import styles from './Board.module.css'
import Square from '../Square/Square.jsx'

function Board({ xIsNext, squares, onPlay }) {
  // Executa a função que calcula o vencedor e retorna o objeto ou null
  const infoVitoria = calculateWinner(squares);

  function handleClick(i) {
    // Bloqueia a jogada se já houver um vencedor ou se o quadrado já estiver ocupado
    if (infoVitoria || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Função auxiliar para renderizar cada Square de forma limpa
  function renderSquare(i) {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        // Converte para booleano: true se houver vitória E o índice 'i' estiver na linha vencedora
        isWinning={Boolean(infoVitoria && infoVitoria.linha.includes(i))}
      />
    );
  }

  // Montagem do status da partida
  let status;
  if (infoVitoria) {
    status = 'Vencedor: ' + infoVitoria.winner;
  } else if (!infoVitoria) {
    status = 'Próximo jogador: ' + (xIsNext ? 'X' : 'O');
  } else {
    status = 'Empate: deu velha'
  }

  return (
    <div className={styles.boardContainer}>
      <div className="h4 mb-3 text-center">{status}</div>
      <div className="d-flex gap-2 mb-2">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="d-flex gap-2 mb-2">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="d-flex gap-2 mb-2">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default Board

// ==========================================
// FUNÇÃO AUXILIAR: calculateWinner
// ==========================================
// Algoritmo que checa se há uma combinação vencedora no tabuleiro
function calculateWinner(squares) {
  // Todas as 8 combinações possíveis de vitória no Jogo da Velha
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
    [0, 4, 8], [2, 4, 6]             // Diagonais
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Retorna o objeto contendo o vencedor e o array com as 3 posições premiadas
      return {
        winner: squares[a],
        linha: lines[i]
      };
    }
  }

  return null;
}