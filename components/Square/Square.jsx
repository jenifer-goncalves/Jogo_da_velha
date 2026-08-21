// COMPONENTE: Square (Quadrado individual)
// Representa uma única casa do tabuleiro.
// Recebe duas 'props': 
// - 'value': o texto a ser exibido ('X', 'O' ou null)
// - 'onSquareClick': a função que deve ser executada quando o botão for clicado

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default Square