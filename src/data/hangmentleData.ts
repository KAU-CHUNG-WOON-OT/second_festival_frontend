// 항멘틀: 정답 단어와 뜻이 얼마나 가까운지(단어 임베딩 유사도)를 실마리로 정답을 찾는 게임.
// 유사도는 scripts/hangmentle/generate.py로 미리 계산해 public/hangmentle/에 둔다.

// scripts/hangmentle/answers.txt의 정답 수와 맞춘다
export const HANGMENTLE_PUZZLE_COUNT = 2;
// 이 순위 안에 들면 몇 위인지 알려 준다 (그 밖은 '1000위 밖')
export const HANGMENTLE_TOP_RANK = 1000;

export const hangmentleVocabUrl = '/hangmentle/vocab.json';
export const hangmentlePuzzleUrl = (puzzleNo: number) => `/hangmentle/puzzles/${puzzleNo}.json`;

export interface HangmentlePuzzleFile {
  // vocab 순서의 유사도 × 10000 (정답은 10000)
  sims: number[];
}

export interface HangmentleGuess {
  word: string;
  // 유사도 × 10000
  similarity: number;
  // 0이면 정답, 1~1000은 가까운 순위, null은 1000위 밖
  rank: number | null;
  // 몇 번째로 추측했는지 (1부터)
  order: number;
}

export type HangmentleGuessResult =
  | { kind: 'unknown'; word: string }
  | { kind: 'duplicate'; word: string }
  | { kind: 'ok'; guess: HangmentleGuess };

export interface HangmentleRound {
  answer: string;
  // 정답을 뺀 가장 가까운 단어·10번째·1000번째의 유사도 × 10000
  hints: { first: number; tenth: number; thousandth: number };
  // 정답과 가장 가까운 단어 (정답 제외, 가까운 순)
  nearest: (count: number) => string[];
  evaluate: (input: string, previous: HangmentleGuess[]) => HangmentleGuessResult;
}

// 띄어쓰기는 무시한다 ('송골 매' → '송골매')
export const normalizeGuess = (input: string) => input.replace(/\s+/g, '');

export const formatSimilarity = (scaled: number) => (scaled / 100).toFixed(2);

export const createHangmentleRound = (vocab: string[], sims: number[]): HangmentleRound => {
  const wordIndex = new Map(vocab.map((word, index) => [word, index]));
  const byCloseness = sims.map((_, index) => index).sort((a, b) => sims[b] - sims[a]);
  const rankOf = new Map<number, number>();
  byCloseness.slice(0, HANGMENTLE_TOP_RANK + 1).forEach((index, rank) => rankOf.set(index, rank));

  return {
    answer: vocab[byCloseness[0]],
    hints: {
      first: sims[byCloseness[1]],
      tenth: sims[byCloseness[10]],
      thousandth: sims[byCloseness[HANGMENTLE_TOP_RANK]],
    },
    nearest: (count) => byCloseness.slice(1, count + 1).map((index) => vocab[index]),
    evaluate: (input, previous) => {
      const word = normalizeGuess(input);
      const index = wordIndex.get(word);
      if (index === undefined) return { kind: 'unknown', word };
      if (previous.some((guess) => guess.word === word)) return { kind: 'duplicate', word };
      return {
        kind: 'ok',
        guess: { word, similarity: sims[index], rank: rankOf.get(index) ?? null, order: previous.length + 1 },
      };
    },
  };
};

// 목록은 가까운 순(같으면 먼저 추측한 순)
export const sortGuesses = (guesses: HangmentleGuess[]) =>
  [...guesses].sort((a, b) => b.similarity - a.similarity || a.order - b.order);
