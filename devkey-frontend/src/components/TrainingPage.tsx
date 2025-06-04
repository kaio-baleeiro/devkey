// src/pages/TrainingPage.tsx
import React, { useState } from 'react';

const initialTargetText = "o texto para digitar aqui"; // Texto de exemplo

function TrainingPage() {
  const [targetText] = useState<string[]>(initialTargetText.split(''));
  const [userInput, setUserInput] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Lógica para lidar com a digitação (onKeyDown no input, por exemplo)
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('handleKeyPress FOI CHAMADA! Tecla:', event.key); // <--- ADICIONE ESTA LINHA
    // Prevenir comportamento padrão se necessário (ex: backspace, tab)
    // event.preventDefault(); // Use com cuidado

    const { key } = event;

    if (key.length === 1) { // Processar apenas teclas de caracteres imprimíveis
      if (currentIndex < targetText.length) {
        const newUserInput = [...userInput];
        newUserInput[currentIndex] = key;
        setUserInput(newUserInput);

        // Simples comparação
        if (key === targetText[currentIndex]) {
          console.log(`Correto: ${key}`);
          // Adicionar lógica para marcar como correto
        } else {
          console.log(`Errado: ${key} vs ${targetText[currentIndex]}`);
          // Adicionar lógica para marcar como errado
        }
        setCurrentIndex(currentIndex + 1);
      }
    } else if (key === 'Backspace') {
      // Lógica para backspace (mais complexa, pode envolver decrementar currentIndex, limpar erro, etc.)
      // Por agora, vamos simplificar ou implementar depois
      if (currentIndex > 0) {
        const newCurrentIndex = currentIndex - 1;
        setCurrentIndex(newCurrentIndex);
        const newUserInput = [...userInput];
        newUserInput[newCurrentIndex] = ''; // Limpa o caractere anterior no input do usuário
        // Precisaria limpar o status de erro/acerto do targetText[newCurrentIndex]
        setUserInput(newUserInput);
      }
    }
    // Outras teclas como Shift, Ctrl, Alt podem ser ignoradas ou tratadas
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-800 text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">DevKey - Treino</h1>
      
      {/* Exibição do Texto Alvo */}
      <div className="text-2xl font-mono p-4 bg-gray-700 rounded-md mb-8 min-w-[600px] text-left">
        {targetText.map((char, index) => {
          let charColor = "text-gray-400"; // Cor padrão para não digitado
          if (index < currentIndex) { // Caracteres já "passados"
            if (userInput[index] === targetText[index]) {
              charColor = "text-green-400"; // Correto
            } else if (userInput[index] !== undefined) { // Se houve input para este index
              charColor = "text-red-400";   // Incorreto
            }
          }
          if (index === currentIndex) {
            charColor = "underline decoration-yellow-400 text-yellow-400"; // Caractere atual
          }

          return (
            <span key={index} className={charColor}>
              {char === ' ' && index < currentIndex && userInput[index] !== targetText[index] ? '_' : char} 
              {/* Visualização de erro em espaço, opcional */}
            </span>
          );
        })}
      </div>

      {/* Input do Usuário (pode ser invisível e capturar globalmente depois) */}
      {/* Por agora, um input visível para depuração */}
      <input
        type="text"
        className="opacity-0 absolute w-0 h-0" // Para torná-lo invisível mas focável
        onKeyDown={handleKeyPress}
        autoFocus // Focar automaticamente para capturar teclas
        // value={userInput.join('').substring(0, currentIndex)} // Controlado pode ser complexo com keydown
        // onChange={() => {}} // Necessário se for controlado, mas onKeyDown é melhor para digitação
      />
      
      <div className="text-sm text-gray-500">
        Comece a digitar. Certifique-se de que a caixa de texto (invisível) está em foco.
      </div>
      {/* Área para Stats (WPM, Precisão) virá depois */}
      {/* <div className="mt-8 text-xl">
        WPM: 0 | Precisão: 100%
      </div> */}
    </div>
  );
}

export default TrainingPage;