// 항멘틀: 정답 단어와 뜻이 얼마나 가까운지(단어 임베딩 유사도)를 실마리로 정답을 찾는 게임.
// 유사도는 scripts/hangmentle/generate.py로 미리 계산해 public/hangmentle/에 둔다.

// scripts/hangmentle/answers.txt의 정답 수와 맞춘다 (문제 파일 1~N)
export const HANGMENTLE_PUZZLE_COUNT = 8;
// 하루에 보여 주는 연습 문제 수 (연습 1, 연습 2)
export const HANGMENTLE_PRACTICE_SLOTS = 2;
// 이날(한국 시간)은 1·2번 문제, 다음 날부터 자정마다 두 문제씩 넘어가고 끝까지 가면 처음부터 다시 돈다
const PRACTICE_START_DAY = Date.UTC(2026, 9, 25) / 86_400_000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 오늘(한국 시간) 연습 1·2에 해당하는 문제 번호. 시작일 전이면 첫날 문제
export const practicePuzzleNos = (nowMs: number): number[] => {
  const kstDay = Math.floor((nowMs + KST_OFFSET_MS) / 86_400_000);
  const dayIndex = Math.max(0, kstDay - PRACTICE_START_DAY);
  return Array.from(
    { length: HANGMENTLE_PRACTICE_SLOTS },
    (_, slot) => ((dayIndex * HANGMENTLE_PRACTICE_SLOTS + slot) % HANGMENTLE_PUZZLE_COUNT) + 1,
  );
};
// 이 순위 안에 들면 몇 위인지 알려 준다 (그 밖은 '1000위 밖')
export const HANGMENTLE_TOP_RANK = 1000;
// 정답을 맞힌 뒤 보여 주는 유사도 순위를 몇 개씩 늘릴지
export const HANGMENTLE_NEAREST_PAGE = 50;
// 입력할 수 있는 단어 길이 (이벤트 서버도 50자까지만 받는다)
export const HANGMENTLE_WORD_MAX_LENGTH = 50;

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

export interface HangmentleNeighbor {
  word: string;
  similarity: number;
  rank: number;
}

export type HangmentleGuessResult =
  | { kind: 'unknown'; word: string }
  // 이미 추측한 단어는 그때 결과를 그대로 돌려준다 (다시 검색해 볼 수 있게)
  | { kind: 'duplicate'; guess: HangmentleGuess }
  | { kind: 'ok'; guess: HangmentleGuess };

export interface HangmentleRound {
  answer: string;
  // 정답을 뺀 가장 가까운 단어·10번째·1000번째의 유사도 × 10000
  hints: { first: number; tenth: number; thousandth: number };
  // 원래 유사도를 화면에 보여 줄 점수(× 10000)로 바꾼다. 순서는 그대로다
  toScore: (similarity: number) => number;
  // 정답과 가장 가까운 단어 (정답 제외, 가까운 순, 순위는 1부터)
  nearest: (count: number) => HangmentleNeighbor[];
  evaluate: (input: string, previous: HangmentleGuess[]) => HangmentleGuessResult;
}

// 띄어쓰기는 무시한다 ('송골 매' → '송골매')
export const normalizeGuess = (input: string) => input.replace(/\s+/g, '');

// 원래 코사인 유사도는 가장 가까운 단어도 40% 안팎이라 낮아 보이므로, 문제마다 기준점에 맞춰 점수를 늘린다.
// 정답 100%, 가장 가까운 단어 99%, 10번째 90%, 1000번째 50%, 관련 없는 단어(유사도 0 이하) 0%.
// 기준점 사이는 원래 유사도에 비례하므로 순서와 순위는 바뀌지 않는다.
const SCORE_ANCHORS = { first: 9900, tenth: 9000, thousandth: 5000 };

export const createScoreScale = (first: number, tenth: number, thousandth: number) => {
  const points: [number, number][] = [
    [0, 0],
    [thousandth, SCORE_ANCHORS.thousandth],
    [tenth, SCORE_ANCHORS.tenth],
    [first, SCORE_ANCHORS.first],
    [10000, 10000],
  ];
  return (similarity: number) => {
    if (similarity <= 0) return 0;
    if (similarity >= 10000) return 10000;
    for (let i = 1; i < points.length; i += 1) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      if (similarity <= x1) {
        return x1 === x0 ? y1 : Math.round(y0 + ((similarity - x0) / (x1 - x0)) * (y1 - y0));
      }
    }
    return 10000;
  };
};

// 점수를 퍼센트로 (정답은 100.00%)
export const formatSimilarity = (scaled: number) => `${(scaled / 100).toFixed(2)}%`;

export const createHangmentleRound = (vocab: string[], sims: number[]): HangmentleRound => {
  const wordIndex = new Map(vocab.map((word, index) => [word, index]));
  const byCloseness = sims.map((_, index) => index).sort((a, b) => sims[b] - sims[a]);
  const rankOf = new Map<number, number>();
  byCloseness.slice(0, HANGMENTLE_TOP_RANK + 1).forEach((index, rank) => rankOf.set(index, rank));

  const hints = {
    first: sims[byCloseness[1]],
    tenth: sims[byCloseness[10]],
    thousandth: sims[byCloseness[HANGMENTLE_TOP_RANK]],
  };

  return {
    answer: vocab[byCloseness[0]],
    hints,
    toScore: createScoreScale(hints.first, hints.tenth, hints.thousandth),
    nearest: (count) =>
      byCloseness
        .slice(1, count + 1)
        .map((index, i) => ({ word: vocab[index], similarity: sims[index], rank: i + 1 })),
    evaluate: (input, previous) => {
      const word = normalizeGuess(input);
      const index = wordIndex.get(word);
      if (index === undefined) return { kind: 'unknown', word };
      const existing = previous.find((guess) => guess.word === word);
      if (existing) return { kind: 'duplicate', guess: existing };
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
