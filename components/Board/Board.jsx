import Square from "../Square/Square.jsx";

// COMPONENTE: Board (Tabuleiro)
// Gerencia a exibição das 9 casas e a verificação do vencedor da rodada.
// Recebe:
// - 'xIsNext': booleano que indica se é a vez do 'X'
// - 'squares': array com o estado atual de todas as 9 casas
// - 'onPlay': função callback para atualizar o jogo ao fazer uma jogada
function Board({ xIsNext, squares, onPlay }) {
  
  // Função executada quando o usuário clica em uma casa específica (índice i)
  function handleClick(i) {
    // REGRA DE NEGÓCIO: Se já houver um vencedor ou se a casa já estiver ocupada, ignora o clique
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    // Imutabilidade: Cria uma cópia do array de casas em vez de alterar o original diretamente
    const nextSquares = squares.slice();
    
    // Define qual símbolo será inserido com base na vez do jogador
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    
    // Notifica o componente pai (Game) sobre o novo estado do tabuleiro
    onPlay(nextSquares);
  }

  // Verifica se a jogada atual gerou um vencedor
  const winner = calculateWinner(squares);
  let status;
  
  // Define a mensagem de status da partida a ser exibida na tela
  if (winner) {
    status = 'Winner: ' + winner; // Mensagem de Vitória
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O'); // Indica o próximo jogador
  }

  return (
    <>
      {/* Exibe o status do jogo */}
      <div className="status">{status}</div>
      
      {/* Renderiza as 3 linhas do tabuleiro, cada uma contendo 3 componentes Square */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
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
    [0, 1, 2], // Linha 1
    [3, 4, 5], // Linha 2
    [6, 7, 8], // Linha 3
    [0, 3, 6], // Coluna 1
    [1, 4, 7], // Coluna 2
    [2, 5, 8], // Coluna 3
    [0, 4, 8], // Diagonal principal
    [2, 4, 6], // Diagonal secundária
  ];
  
  // Percorre todas as combinações
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Se a posição 'a' não for nula e for igual a 'b' e 'c', temos um vencedor
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Retorna 'X' ou 'O'
    }
  }
  return null; // Retorna null se ainda não houver vencedor
}

