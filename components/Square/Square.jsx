import styles from './Square.module.css'

// COMPONENTE: Square (Quadrado individual)
// Representa uma única casa do tabuleiro.
// Recebe duas 'props': 
// - 'value': o texto a ser exibido ('X', 'O' ou null)
// - 'onSquareClick': a função que deve ser executada quando o botão for clicado


function Square({ value, onSquareClick, isWinning}) {

  let squareClasses = `btn ${styles.square}`;

  // Caso este quadrado faça parte da trinca vencedora, adicionamos classes de destaque
  // 'bg-success' e 'text-white' são classes utilitárias nativas do Bootstrap
  if (isWinning) {
    squareClasses += ` bg-success text-white ${styles.winningSquare}`;
  }


  return (
    <button className={squareClasses} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default Square