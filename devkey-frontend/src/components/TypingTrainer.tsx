import React, { useEffect, useRef, useState } from 'react';

const baseCharSet = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  special: "!@#$%^&*()_+-=[]{};':\",./<>?`~",
};

const samplePhrases = [
  'CONTRATOS', 'PRONTOS', 'ACEITAS', 'ATIRE', 'PORTA', 'ASSENTO', 'PONTAS', 'TEORIAS', 'CONSISTE',
  'RAPTO', 'COSTAS', 'CAPACETE', 'FETO', 'FANTASIAS', 'RESTAURANTE', 'AZUL', 'VOCE', 'VERDADE',
  'TEMPO', 'MUNDO', 'KEYBR', 'TESTE', 'DIGITAR', 'RAPIDO', 'PRECISAO', 'INTERFACE', 'CODIGO', 'SIMPLES',
  'COMPUTADOR', 'PROGRAMACAO', 'DESENVOLVEDOR', 'ALGORITMO', 'ESTRUTURA', 'VARIAVEL', 'FUNCAO',
];

function getFullCharPoolForDisplay() {
  return (baseCharSet.uppercase + baseCharSet.numbers + baseCharSet.special).split('').sort().join('');
}

const TypingTrainer: React.FC = () => {
  const [disabledChars, setDisabledChars] = useState<Set<string>>(new Set());
  const [enableSpecialChars, setEnableSpecialChars] = useState(false);
  const [enableNumbers, setEnableNumbers] = useState(true);
  const [enableRandomCombinations, setEnableRandomCombinations] = useState(false);
  const [targetTextChars, setTargetTextChars] = useState<string[]>([]);
  const [currentTypedIndex, setCurrentTypedIndex] = useState(0);
  const [stats, setStats] = useState<{ hits: number; misses: number; startTime: Date | null; totalCharsTypedCorrectly: number; }>({ hits: 0, misses: 0, startTime: null, totalCharsTypedCorrectly: 0 });

  const userInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateWordsToType();
    if (userInputRef.current) userInputRef.current.focus();
    // eslint-disable-next-line
  }, [enableSpecialChars, enableNumbers, enableRandomCombinations, disabledChars]);

  function toggleCharDisabledState(char: string) {
    setDisabledChars((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(char)) newSet.delete(char);
      else newSet.add(char);
      return newSet;
    });
  }

  function getActiveCharsForWordGeneration() {
    let activeCharsForRandom = '';
    let activeCharsForFilteringSet = new Set<string>();
    baseCharSet.uppercase.split('').forEach((char, idx) => {
      if (!disabledChars.has(char)) {
        activeCharsForRandom += baseCharSet.lowercase[idx];
        activeCharsForFilteringSet.add(char);
      }
    });
    if (enableNumbers) {
      baseCharSet.numbers.split('').forEach((char) => {
        if (!disabledChars.has(char)) {
          activeCharsForRandom += char;
          activeCharsForFilteringSet.add(char);
        }
      });
    }
    if (enableSpecialChars) {
      baseCharSet.special.split('').forEach((char) => {
        if (!disabledChars.has(char)) {
          activeCharsForRandom += char;
          activeCharsForFilteringSet.add(char);
        }
      });
    }
    return {
      forRandomGeneration: activeCharsForRandom,
      forFilteringSamples: activeCharsForFilteringSet,
    };
  }

  function generateRandomNumberSequence(minLength = 3, maxLength = 7) {
    const activeNumbers = baseCharSet.numbers.split('').filter((n) => !disabledChars.has(n) && enableNumbers).join('');
    if (activeNumbers.length === 0) return '';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let numberSeq = '';
    for (let i = 0; i < length; i++) {
      numberSeq += activeNumbers.charAt(Math.floor(Math.random() * activeNumbers.length));
    }
    return numberSeq;
  }

  function generateWordsToType() {
    const { forRandomGeneration, forFilteringSamples } = getActiveCharsForWordGeneration();
    let words: string[] = [];
    if (enableRandomCombinations) {
      if (forRandomGeneration.length > 0) {
        for (let i = 0; i < 15; i++) {
          let wordLength = Math.floor(Math.random() * 5) + 3;
          let randomWord = '';
          for (let j = 0; j < wordLength; j++) {
            randomWord += forRandomGeneration.charAt(Math.floor(Math.random() * forRandomGeneration.length));
          }
          words.push(randomWord.toUpperCase());
        }
      } else {
        words.push('---');
      }
    } else {
      let tempWords = [...samplePhrases].sort(() => 0.5 - Math.random());
      words = tempWords
        .map((word) => {
          const filteredWord = word
            .toUpperCase()
            .split('')
            .filter((char) => forFilteringSamples.has(char))
            .join('');
          return filteredWord;
        })
        .filter((word) => word.length > 1);
      if (words.length < 5) {
        words = ['FILTRO', 'MUITO', 'RIGIDO'];
        if (forRandomGeneration.length > 0) {
          for (let i = 0; i < 3; i++) {
            words.push(forRandomGeneration.charAt(Math.floor(Math.random() * forRandomGeneration.length)).repeat(4).toUpperCase());
          }
        }
      }
      words = words.slice(0, 12);
    }
    if (enableNumbers) {
      const activeNumbersForSequence = baseCharSet.numbers.split('').filter((n) => !disabledChars.has(n)).join('');
      if (activeNumbersForSequence.length > 0) {
        const numberOfNumericWords = enableRandomCombinations ? 4 : Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numberOfNumericWords; i++) {
          const numSeq = generateRandomNumberSequence();
          if (numSeq) {
            words.splice(Math.floor(Math.random() * (words.length + 1)), 0, numSeq);
          }
        }
      }
    }
    words = words.sort(() => 0.5 - Math.random()).slice(0, 15);
    const fullText = words.filter((w) => w.length > 0).join(' ');
    setTargetTextChars(fullText.split(''));
    setCurrentTypedIndex(0);
    setStats({ hits: 0, misses: 0, startTime: null, totalCharsTypedCorrectly: 0 });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (currentTypedIndex >= targetTextChars.length && targetTextChars.length > 0) {
      generateWordsToType();
      return;
    }
    if (targetTextChars.length === 0) {
      if (userInputRef.current) userInputRef.current.value = '';
      return;
    }
    if (!stats.startTime && currentTypedIndex === 0) {
      setStats((prev) => ({ ...prev, startTime: new Date() as Date }));
    }
    const pressedKey = e.key;
    const targetChar = targetTextChars[currentTypedIndex];
    if (
      [
        'Shift',
        'Control',
        'Alt',
        'Meta',
        'CapsLock',
        'Tab',
        'Escape',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'Insert',
        'Delete',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
      ].includes(pressedKey) && pressedKey !== targetChar
    ) {
      return;
    }
    if (pressedKey.length === 1 || pressedKey === 'Backspace') {
      e.preventDefault();
      if (pressedKey === 'Backspace') {
        if (currentTypedIndex > 0) {
          setCurrentTypedIndex((idx) => idx - 1);
        }
      } else {
        const keyForComparison = pressedKey.toUpperCase();
        if (keyForComparison === targetChar || (targetChar === ' ' && pressedKey === ' ')) {
          setStats((prev) => ({
            ...prev,
            hits: prev.hits + 1,
            totalCharsTypedCorrectly: prev.totalCharsTypedCorrectly + 1,
          }));
        } else {
          setStats((prev) => ({ ...prev, misses: prev.misses + 1 }));
        }
        setCurrentTypedIndex((idx) => idx + 1);
      }
    }
    if (userInputRef.current) userInputRef.current.value = '';
  }

  // Métricas
  const totalTyped = stats.hits + stats.misses;
  const accuracy = totalTyped > 0 ? ((stats.hits / totalTyped) * 100).toFixed(1) : '--';
  let wpm: string | number = '--';
  if (stats.startTime && stats.totalCharsTypedCorrectly > 0) {
    const currentTime = new Date();
    const timeDiffSeconds = stats.startTime ? (currentTime.getTime() - stats.startTime.getTime()) / 1000 : 0;
    if (timeDiffSeconds > 0.5) {
      wpm = ((stats.totalCharsTypedCorrectly / 5) / (timeDiffSeconds / 60)).toFixed(1);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-[#323437] text-[#d1d0c5] min-h-screen flex flex-col items-center">
      <section className="flex flex-wrap justify-around w-full py-2 mb-5 text-sm border-b border-[#4a4d50] text-[#646669]">
        <div>
          <strong className="text-[#646669] mr-1">Acurácia:</strong>{' '}
          <span className="text-[#d1d0c5] font-bold">{accuracy}</span>%
        </div>
        <div>
          <strong className="text-[#646669] mr-1">Acertos:</strong>{' '}
          <span className="text-[#d1d0c5] font-bold">{stats.hits}</span>
        </div>
        <div>
          <strong className="text-[#646669] mr-1">Erros:</strong>{' '}
          <span className="text-[#d1d0c5] font-bold">{stats.misses}</span>
        </div>
        <div>
          <strong className="text-[#646669] mr-1">Velocidade:</strong>{' '}
          <span className="text-[#d1d0c5] font-bold">{wpm}</span> WPM
        </div>
      </section>
      <section className="bg-black/10 p-4 rounded-lg mb-6">
        <p className="text-xs text-[#646669] mb-2">
          <strong className="text-[#d1d0c5]">Caracteres disponíveis</strong> (clique para desabilitar/habilitar):
        </p>
        <div className="mb-3 p-2 bg-black/10 rounded text-center">
          {getFullCharPoolForDisplay().split('').map((char) => (
            <span
              key={char}
              className={`inline-block px-2 py-1 m-1 rounded cursor-pointer text-sm select-none transition font-mono ${
                disabledChars.has(char)
                  ? 'bg-[#ca4754] text-[#d1d0c5]' // disabled
                  : 'bg-[#4a4d50] text-[#d1d0c5] hover:bg-[#5f6266] hover:scale-110'
              }`}
              onClick={() => toggleCharDisabledState(char)}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-5 justify-center pt-2">
          <label className="inline-flex items-center cursor-pointer text-[#d1d0c5]">
            <input
              type="checkbox"
              className="hidden"
              checked={enableSpecialChars}
              onChange={() => setEnableSpecialChars((v) => !v)}
            />
            <span className={`w-[18px] h-[18px] border-2 rounded mr-2 flex items-center justify-center ${enableSpecialChars ? 'bg-[#44475a] border-[#50fa7b]' : 'border-[#6272a4]'}`}>{enableSpecialChars && <span className="w-2 h-3 border-b-4 border-r-4 border-[#50fa7b] rotate-45 block"></span>}</span>
            Caracteres Especiais
          </label>
          <label className="inline-flex items-center cursor-pointer text-[#d1d0c5]">
            <input
              type="checkbox"
              className="hidden"
              checked={enableNumbers}
              onChange={() => setEnableNumbers((v) => !v)}
            />
            <span className={`w-[18px] h-[18px] border-2 rounded mr-2 flex items-center justify-center ${enableNumbers ? 'bg-[#44475a] border-[#50fa7b]' : 'border-[#6272a4]'}`}>{enableNumbers && <span className="w-2 h-3 border-b-4 border-r-4 border-[#50fa7b] rotate-45 block"></span>}</span>
            Números
          </label>
          <label className="inline-flex items-center cursor-pointer text-[#d1d0c5]">
            <input
              type="checkbox"
              className="hidden"
              checked={enableRandomCombinations}
              onChange={() => setEnableRandomCombinations((v) => !v)}
            />
            <span className={`w-[18px] h-[18px] border-2 rounded mr-2 flex items-center justify-center ${enableRandomCombinations ? 'bg-[#44475a] border-[#50fa7b]' : 'border-[#6272a4]'}`}>{enableRandomCombinations && <span className="w-2 h-3 border-b-4 border-r-4 border-[#50fa7b] rotate-45 block"></span>}</span>
            Combinações Aleatórias
          </label>
        </div>
      </section>
      <section className="typing-area-container mt-5 w-full">
        <div className="text-to-type-box text-2xl leading-relaxed mb-8 p-6 rounded-lg bg-black/15 min-h-[100px] tracking-wide text-left select-none whitespace-pre-wrap font-mono">
          {targetTextChars.map((char, idx) => (
            <span
              key={idx}
              className={`char-typed px-[0.2em] py-[0.05em] rounded ${
                idx === currentTypedIndex
                  ? 'char-current bg-[#e2b714] text-[#323437]'
                  : idx < currentTypedIndex
                  ? (char === (targetTextChars[idx] || '') ? 'char-correct text-[#6aaa64]' : 'char-incorrect text-[#ca4754] bg-[#ca475420]')
                  : ''
              }`}
            >
              {char}
            </span>
          ))}
        </div>
        <input
          ref={userInputRef}
          type="text"
          className="user-input-field absolute opacity-0 w-0 h-0 border-none p-0 m-0"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          onKeyDown={handleKeyDown}
        />
      </section>
    </div>
  );
};

export default TypingTrainer;
