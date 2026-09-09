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
  function handleProximaPartida(vencedor, deuEmpate) {
    // Atualiza a pontuação no placar acumulado
    setPlacar((prev) => ({
      x: vencedor === 'X' ? prev.x + 1 : prev.x,
      o: vencedor === 'O' ? prev.o + 1 : prev.o,
      empates: deuEmpate ? prev.empates + 1 : prev.empates,
    }));

    // Registra que mais uma partida foi concluída
    setPartidasJogadas((prev) => prev + 1);
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

  return (
  // Container principal do jogo estilizado via CSS Modules
  <div className={styles.gameContainer}>
    {/* Título principal estilizado */}
    <h1 className={styles.gameTitle}>Jogo da Velha</h1>

    {/* ==========================================
        BLOCO 1: PLACAR GERAL DO CAMPEONATO (Bootstrap Card)
        ========================================== */}
    <div className="card p-3 mb-4 text-center shadow-sm">
      <h4>Placar do Campeonato (Partida {partidasJogadas + 1} de 5)</h4>
      <div className="d-flex justify-content-center gap-3 mt-2">
        <span className="badge bg-primary fs-6">Jogador X: {placar.x}</span>
        <span className="badge bg-secondary fs-6">Empates: {placar.empates}</span>
        <span className="badge bg-danger fs-6">Jogador O: {placar.o}</span>
      </div>
    </div>

    {/* ==========================================
        BLOCO 2: RENDERIZAÇÃO CONDICIONAL (Ternário)
        Se campeonatoFinalizado for true -> Exibe Card do Campeão
        Se for false -> Exibe o Tabuleiro e o Histórico
        ========================================== */}
    {campeonatoFinalizado ? (
      /* Tela de Fim de Campeonato */
      <div className="alert alert-success text-center p-4">
        <h2>🏆 Campeonato Encerrado!</h2>
        <button className="btn btn-primary mt-3" onClick={handleZerarCampeonato}>
          Iniciar Novo Campeonato
        </button>
      </div>
    ) : (
      /* Grid do Bootstrap: divide a tela em duas colunas no computador (md) */
      <div className="row mt-4">
        
        {/* COLUNA ESQUERDA (7 colunas): Tabuleiro + Botão de Próxima Partida */}
        <div className="col-md-7 d-flex flex-column align-items-center mb-3">
          <Board 
            xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay} 
          />

          {/* O botão verde só surge quando a rodada atual termina */}
          {rodadaEncerrada && (
            <button className="btn btn-success mt-3" onClick={handleProximaPartida}>
              Confirmar Resultado e Ir para Próxima Partida ➡️
            </button>
          )}
        </div>

        {/* COLUNA DIREITA (5 colunas): Histórico de Jogadas (Viagem no Tempo) */}
        <div className="col-md-5">
          <h4 className="mb-3">Histórico da Partida</h4>
          {/* Lista de botões gerados pelo .map() */}
          <ol className="list-unstyled">{moves}</ol>
        </div>

      </div>
    )}
  </div>
);
}