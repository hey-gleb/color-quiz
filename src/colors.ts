const getRandomHexChar = () => {
  const letters = '0123456789ABCDEF';
  return letters[Math.floor(Math.random() * 16)];
};

export const getRandomColor = (): string => {
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

export const mixColors = (c1: string, c2: string) => {
  const toRGB = (hex: string) =>
    hex.match(/\w\w/g)?.map((x) => parseInt(x, 16)) ?? [0, 0, 0];

  const avg = (a: number, b: number) => Math.round((a + b) / 2);

  const [r1, g1, b1] = toRGB(c1);
  const [r2, g2, b2] = toRGB(c2);

  return (
    '#' +
    [avg(r1, r2), avg(g1, g2), avg(b1, b2)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
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
