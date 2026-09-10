import { useState } from 'react';
import Board, { calculateWinner }from "../Board/Board.jsx";
import styles from './Game.module.css';


// COMPONENTE PRINCIPAL: Game (Jogo)

// Gerencia o estado global, histórico de jogadas e a "viagem no tempo".
export default function Game() {
  // Estado que armazena a lista de jogadas (array de arrays de 9 posições)
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // Estado que guarda o índice da jogada atual que o usuário está visualizando
  const [currentMove, setCurrentMove] = useState(0);
  // Estado para armazenar as pontuações acumuladas
  const [placar, setPlacar] = useState({ x: 0, o: 0, empates: 0 });
  // Estado para controlar quantas partidas já foram finalizadas (de 0 a 5)
  const [partidasJogadas, setPartidasJogadas] = useState(0);
  

  // Define se é a vez do 'X' com base no número da jogada atual (se par = X, se ímpar = O)
  const xIsNext = currentMove % 2 === 0;
  
  // Pega o estado do tabuleiro na jogada atual
  const currentSquares = history[currentMove];

  // Regra de negócio: verifica se o campeonato de 5 partidas terminou
  const campeonatoFinalizado = partidasJogadas === 5;

  const infoVitoria = calculateWinner(currentSquares);
  const deuEmpate = !infoVitoria && currentSquares.every((square) => square !== null);
  const rodadaEncerrada = Boolean(infoVitoria) || deuEmpate;



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

  //Avança para a PRÓXIMA partida do campeonato (atualiza placar e reseta tabuleiro)
  function handleProximaPartida() {
    console.log('Teste: O botão Próxima Partida foi Clicado!');
    
    // Atualiza a pontuação no placar acumulado
    setPlacar((placar) => ({
      x: infoVitoria === 'X' ? placar.x + 1 : placar.x,
      o: infoVitoria === 'O' ? placar.o + 1 : placar.o,
      empates: deuEmpate ? placar.empates + 1 : placar.empates,
    }));

    // Registra que mais uma partida foi concluída
    setPartidasJogadas((partidasJogadas) => partidasJogadas + 1);
    // Reseta o tabuleiro para iniciar a nova partida do zero
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  //Zera o campeonato inteiro (reinicia placar e partidas)
  function handleZerarCampeonato() {
    setPlacar({ x: 0, o: 0, empates: 0 });
    setPartidasJogadas(0);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
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


  console.log('Objeto placar atual:', placar);

  return (
  /* Container principal centralizado via CSS Module */
  <div className={styles.gameContainer}>
    
    {/* Título estilizado do jogo */}
    <h1 className={styles.gameTitle}>Jogo da Velha</h1>

    <div className={`card p-3 mb-4 text-center shadow-sm ${styles.scoreCard}`}>
      <h4 className="card-title mb-3">Placar do Campeonato (Partida {partidasJogadas + 1} de 5)</h4>
      <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
        <span className="badge bg-primary p-2 fs-6">Jogador X: {placar.x}</span>
        <span className="badge bg-secondary p-2 fs-6">Empates: {placar.empates}</span>
        <span className="badge bg-danger p-2 fs-6">Jogador O: {placar.o}</span>
      </div>
    </div>

    {campeonatoFinalizado ? (
      /* Tela de Fim de Campeonato com utilitários de alerta do Bootstrap */
      <div className="alert alert-success text-center p-4 w-100">
        <h2>🏆 Campeonato Encerrado!</h2>
        <button className={styles.gameProximaPartida} onClick={handleZerarCampeonato}>
          Iniciar Novo Campeonato
        </button>
      </div>
    ) : (
      /* Container flex do CSS Module que posiciona o Histórico na esquerda e o Tabuleiro na direita */
      <div className={styles.game}>
        
        {/* LADO ESQUERDO: Painel do Histórico de Jogadas (Declarado PRIMEIRO) */}
        <div className={styles.gameInfo}>
          <h4>Histórico da Partida</h4>
          {/* A lista herda os estilos dos botões definidos em .gameInfo button no CSS */}
          <ol className="list-unstyled d-flex flex-column gap-2">{moves}</ol>
        </div>

        {/* LADO DIREITO: Tabuleiro de Jogo (Declarado em SEGUIDA) */}
        <div className={styles.gameBoard}>
          <Board 
            xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay} 
          />

          {/* Botão verde do Bootstrap que aparece ao encerrar a rodada */}
          {rodadaEncerrada && (
            <button className={styles.gameProximaPartida} onClick={handleProximaPartida}>
              Próxima Partida
            </button>
          )}
        </div>

      </div>
    )}
  </div>
);
}