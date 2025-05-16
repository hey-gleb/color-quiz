import { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { motion } from 'framer-motion';

import './App.css';

const colors = [
  { hex: '#FF5733', isCorrect: true },
  { hex: '#33FFCE', isCorrect: false },
  { hex: '#FF33A8', isCorrect: false },
  { hex: '#FFA533', isCorrect: false },
];

function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelect = (hex: string) => {
    if (showAnswer) return;
    setSelected(hex);
    setShowAnswer(true);
    setTimeout(() => {
      setSelected(null);
      setShowAnswer(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border border-zinc-700 bg-zinc-800">
        <CardContent className="p-6 flex flex-col items-center">
          <div
            className="w-40 h-40 rounded-xl mb-10 border border-zinc-700"
            style={{ backgroundColor: colors.find((c) => c.isCorrect)!.hex }}
          />
          <div className="grid grid-cols-2 gap-4 w-full">
            {colors.map(({ hex, isCorrect }) => {
              const isSelected = selected === hex;
              const isRight = showAnswer && isCorrect;
              const isWrong = showAnswer && isSelected && !isCorrect;
              return (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={hex}
                  onClick={() => handleSelect(hex)}
                  className={`py-3 px-4 rounded-xl font-mono text-sm transition-all duration-300 border 
                    ${isRight ? 'bg-green-500 text-black border-green-500' : ''}
                    ${isWrong ? 'bg-red-500 text-black border-red-500' : ''}
                    ${!isRight && !isWrong ? 'bg-zinc-700 hover:bg-zinc-600 border-zinc-600' : ''}
                  `}
                >
                  {hex}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
