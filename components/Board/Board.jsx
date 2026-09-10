import styles from './Board.module.css';
import Square from '../Square/Square.jsx';

function Board({ xIsNext, squares, onPlay }) {
  // Executa o algoritmo de verificação e armazena o objeto { vencedor, linha } ou null
  const vencedorInfo = calculateWinner(squares);

  // RF05: Condição de empate (sem vencedor e todas as casas preenchidas)
  const deuEmpate = !vencedorInfo && squares.every((square) => square !== null);

  function handleClick(i) {
    // RF03: Bloqueia a jogada se já houver um vencedor ou se a célula já estiver ocupada
    if (vencedorInfo || squares[i]) {
      return;
    }

    // Mantém a imutabilidade criando uma cópia do array de estado
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Função auxiliar para renderizar cada célula (Square)
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        // RF10: Passa true se a célula atual fizer parte da trinca vencedora
        isWinning={Boolean(vencedorInfo && vencedorInfo.linha.includes(i))}
      />
    );
  }

  // RF06: Montagem da mensagem do status da partida
  let status;
  if (vencedorInfo) {
    status = 'Vencedor: ' + vencedorInfo.vencedor; // Exibe o símbolo do vencedor ('X' ou 'O')
  } else if (deuEmpate) {
    status = 'Empate! Deu velha...';
  } else {
    status = 'Próximo jogador: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className={styles.boardContainer}>
      {/* Mensagem de status visual do jogo */}
      <div className={styles.status}>{status}</div>

      {/* PRIMEIRA LINHA */}
      <div className={styles.boardRow}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>

      {/* SEGUNDA LINHA */}
      <div className={styles.boardRow}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>

      {/* TERCEIRA LINHA */}
      <div className={styles.boardRow}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default Board;

// ==========================================
// FUNÇÃO AUXILIAR: calculateWinner
// ==========================================
export function calculateWinner(squares) {
  // Matriz com as 8 combinações vitoriosas (linhas, colunas e diagonais)
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
    [0, 4, 8], [2, 4, 6]             // Diagonais
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // RF04 e RF10: Retorna o objeto com o símbolo do vencedor e o array com as 3 posições vitoriosas
      return {
        vencedor: squares[a],
        linha: [a, b, c] // Correção: Array com os três índices vitoriosos
      };
    }
  }

  return null;
}