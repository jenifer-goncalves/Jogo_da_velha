import { useState } from 'react';
import Game from '../components/Game/Game';

function App(){


return(
  <>
  <main className="container my-4">
      {/* Aqui você pode adicionar um título principal do projeto utilizando classes do Bootstrap */}
      <h1 className="text-center mb-4">Jogo da Velha 🎲</h1>
      
      {/* Renderização do componente principal do jogo */}
      <Game />
    </main>
  </>
);
}

export default App




