// src/App.tsx
import TypingTrainer from './components/TypingTrainer';
import './App.css'; // Ou seu CSS global, se houver
import Header from './components/header';
import './index.css';

function App() {
  return (
    <>
      <Header />
      <TypingTrainer />
    </>
  );
}

export default App;