import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() { 
  return (
    <div style={{ paddingTop: '20px', textAlign: 'center' }}> {/* Estilo inline para ajudar a centralizar e ver o h1 */}
      <h1 className="bg-red-500 text-yellow-300 p-10 text-4xl font-bold">
        TESTE TAILWIND VIVO!
      </h1>
      <p className="mt-4 text-white">
        Se o H1 acima tiver fundo vermelho e texto amarelo, o Tailwind está aplicando cores!
      </p>
    </div>
  );
}

export default App;
