import { useState } from 'react';
import Board, { calculateWinner } from "../Board/Board.jsx";
import styles from './Game.module.css';

// COMPONENTE PRINCIPAL: Game
// Gerencia o estado global, histórico de jogadas, placar e ciclo do campeonato.
export default function Game() {
  // Estados da aplicação
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [placar, setPlacar] = useState({ x: 0, o: 0, empates: 0 });
  const [partidasJogadas, setPartidasJogadas] = useState(0);

  // RF02: Define a vez do jogador ('X' para jogadas pares, 'O' para ímpares)
  const xIsNext = currentMove % 2 === 0;

  // Obtém a fotografia do tabuleiro no turno atual
  const currentSquares = history[currentMove];

  // Executa o cálculo de vitória
  const infoVitoria = calculateWinner(currentSquares);

  // EXTRAÇÃO DO SÍMBOLO: Acessa a propriedade .vencedor se o objeto existir (ex: 'X' ou 'O')
  const simboloVencedor = infoVitoria?.vencedor;

  // RF05: Condição de empate no nível do Game
  const deuEmpate = !infoVitoria && currentSquares.every((square) => square !== null);

  // Controla a exibição do botão "Próxima Partida"
  const rodadaEncerrada = Boolean(infoVitoria) || deuEmpate;

  // Regra de negócio: encerra o campeonato ao completar 5 partidas
  const campeonatoFinalizado = partidasJogadas === 5;

  // Atualiza o histórico de jogadas mantendo a imutabilidade
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // RF08: Navegação temporal no histórico
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Atualiza o placar e avança para a próxima partida
  function handleProximaPartida() {
    // Atualização funcional do estado do placar
    setPlacar((placarAnterior) => ({
      x: simboloVencedor === 'X' ? placarAnterior.x + 1 : placarAnterior.x,
      o: simboloVencedor === 'O' ? placarAnterior.o + 1 : placarAnterior.o,
      empates: deuEmpate ? placarAnterior.empates + 1 : placarAnterior.empates,
    }));

    // Incrementa a contagem de partidas finalizadas
    setPartidasJogadas((qtd) => qtd + 1);

    // Reseta o tabuleiro para uma nova partida
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // RF09: Reinicia todo o campeonato (placar e rodadas)
  function handleZerarCampeonato() {
    setPlacar({ x: 0, o: 0, empates: 0 });
    setPartidasJogadas(0);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // Mapeia o histórico para a renderização dos botões da viagem no tempo
  const moves = history.map((squares, move) => {
    const description = move > 0 ? 'Jogada #' + move : 'Início do jogo';
    return (
      <li key={move}>
        <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.gameTitle}>Jogo da Velha</h1>

      {/* Cartão de Placar Acumulado */}
      <div className={`card p-3 mb-4 text-center shadow-sm ${styles.scoreCard}`}>
        <h4 className="card-title mb-3">
          Placar do Campeonato (Partida {partidasJogadas + 1} de 5)
        </h4>
        <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
          <span className="badge bg-primary p-2 fs-6">Jogador X: {placar.x}</span>
          <span className="badge bg-secondary p-2 fs-6">Empates: {placar.empates}</span>
          <span className="badge bg-danger p-2 fs-6">Jogador O: {placar.o}</span>
        </div>
      </div>

      {/* Renderização condicional do término do campeonato */}
      {campeonatoFinalizado ? (
        <div className="alert alert-success text-center p-4 w-100">
          <h2>🏆 Campeonato Encerrado!</h2>
          <button className="btn btn-success mt-3" onClick={handleZerarCampeonato}>
            Iniciar Novo Campeonato
          </button>
        </div>
      ) : (
        <div className={styles.game}>
          {/* Painel do Histórico */}
          <div className={styles.gameInfo}>
            <h4>Histórico da Partida</h4>
            <ol className="list-unstyled d-flex flex-column gap-2">{moves}</ol>
          </div>

          {/* Tabuleiro e Botão de Ação */}
          <div className={styles.gameBoard}>
            <Board 
              xIsNext={xIsNext} 
              squares={currentSquares} 
              onPlay={handlePlay} 
            />

            {rodadaEncerrada && (
              <button className={`${styles.gameProximaPartida} mt-3`} onClick={handleProximaPartida}>
                Próxima Partida
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}