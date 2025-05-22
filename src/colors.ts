const getRandomHexChar = () => {
  const letters = '0123456789ABCDEF';
  return letters[Math.floor(Math.random() * 16)];
};

const getRandomColor = (): string => {
  return '#' + Array.from({ length: 6 }, () => getRandomHexChar()).join('');
};

const getUniqueRandomHexChar = (currentChars: string[] = []) => {
  if (currentChars.length === 0) return getRandomHexChar();
  let hexChar = currentChars[0];
  while (!currentChars.includes(hexChar)) {
    hexChar = getRandomHexChar();
  }
  return getRandomHexChar();
};

export const generateQuestion = (
  currentRounds: number
): { options: string[]; answer: string } => {
  const colorGeneratorStrategyMap: Record<number, () => string> = {
    1: () => {
      const hexChar = getUniqueRandomHexChar();
      return '#' + Array.from({ length: 6 }, () => hexChar).join('');
    },
    2: () => {
      const hexChar1 = getUniqueRandomHexChar();
      const hexChar2 = getUniqueRandomHexChar([hexChar1]);
      return (
        '#' +
        [hexChar1, hexChar1, hexChar1, hexChar2, hexChar2, hexChar2].join('')
      );
    },
    3: () => {
      {
        const hexChar1 = getUniqueRandomHexChar();
        const hexChar2 = getUniqueRandomHexChar([hexChar1]);
        const hexChar3 = getUniqueRandomHexChar([hexChar1, hexChar2]);
        return (
          '#' +
          [hexChar1, hexChar1, hexChar2, hexChar2, hexChar3, hexChar3].join('')
        );
      }
    },
    4: () => {
      {
        const hexChar1 = getRandomHexChar();
        return (
          '#' +
          [
            getRandomHexChar(),
            hexChar1,
            hexChar1,
            getRandomHexChar(),
            getRandomHexChar(),
            getRandomHexChar(),
          ].join('')
        );
      }
    },
    5: () => getRandomColor(),
  };
  const colorGenerator = colorGeneratorStrategyMap[currentRounds];
  if (!colorGenerator)
    return {
      answer: '#000000',
      options: ['#000000'],
    };
  const answer = colorGenerator();
  const options = [answer];
  while (options.length < 4) {
    const color = colorGenerator();
    if (!options.includes(color)) options.push(color);
  }
  return {
    answer,
    options: options.sort(() => Math.random() - 0.5),
  };
};
