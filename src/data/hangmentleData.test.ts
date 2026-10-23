import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  HANGMENTLE_PUZZLE_COUNT,
  HANGMENTLE_TOP_RANK,
  createHangmentleRound,
  createScoreScale,
  formatSimilarity,
  normalizeGuess,
  sortGuesses,
} from './hangmentleData';

// 정답(축제)이 10000이고 나머지는 단어 순서대로 점점 멀어지는 가짜 퍼즐
const vocab = ['공연', '축제', '음악', ...Array.from({ length: 1200 }, (_, i) => `단어${i}`)];
const sims = vocab.map((word, i) => (word === '축제' ? 10000 : 5000 - i));

describe('createHangmentleRound', () => {
  const round = createHangmentleRound(vocab, sims);

  it('유사도가 가장 높은 단어가 정답이다', () => {
    expect(round.answer).toBe('축제');
  });

  it('정답은 0위, 가까운 단어는 순위, 1000위 밖은 null', () => {
    const answer = round.evaluate('축제', []);
    const near = round.evaluate('공연', []);
    const far = round.evaluate('단어1100', []);
    expect(answer.kind === 'ok' && answer.guess.rank).toBe(0);
    expect(near.kind === 'ok' && near.guess.rank).toBe(1);
    expect(far.kind === 'ok' && far.guess.rank).toBeNull();
  });

  it('목록에 없는 단어를 알려 주고, 이미 추측한 단어는 그때 결과를 다시 돌려준다', () => {
    expect(round.evaluate('없는말', []).kind).toBe('unknown');
    const first = round.evaluate('음악', []);
    expect(first.kind).toBe('ok');
    if (first.kind !== 'ok') return;
    expect(round.evaluate(' 음악 ', [first.guess])).toEqual({ kind: 'duplicate', guess: first.guess });
  });

  it('힌트는 정답을 뺀 1·10·1000번째 유사도다', () => {
    // 정답(1번 자리)을 빼면 k번째로 가까운 단어는 vocab의 k번 자리(공연만 0번)
    expect(round.hints.first).toBe(5000);
    expect(round.hints.tenth).toBe(5000 - 10);
    expect(round.hints.thousandth).toBe(5000 - HANGMENTLE_TOP_RANK);
  });

  it('점수는 정답 100%, 가장 가까운 단어 99%, 10번째 90%, 1000번째 50%', () => {
    expect(round.toScore(10000)).toBe(10000);
    expect(round.toScore(round.hints.first)).toBe(9900);
    expect(round.toScore(round.hints.tenth)).toBe(9000);
    expect(round.toScore(round.hints.thousandth)).toBe(5000);
  });

  it('가장 가까운 단어에 정답은 들어가지 않는다', () => {
    expect(round.nearest(2)).toEqual([
      { word: '공연', similarity: 5000, rank: 1 },
      { word: '음악', similarity: 4998, rank: 2 },
    ]);
  });
});

describe('createScoreScale', () => {
  // 실제 문제 1(유행어)의 기준점: 41.69% · 31.93% · 19.12%
  const toScore = createScoreScale(4169, 3193, 1912);

  it('기준점 사이는 원래 유사도에 비례한다', () => {
    expect(toScore(956)).toBe(2500); // 0과 1000번째의 한가운데
  });

  it('유사도가 0 이하면 0점이다', () => {
    expect(toScore(0)).toBe(0);
    expect(toScore(-500)).toBe(0);
  });

  it('원래 유사도 순서를 바꾸지 않는다', () => {
    const raw = [-300, 0, 500, 1912, 2500, 3193, 3800, 4169, 6000, 10000];
    const scores = raw.map(toScore);
    expect([...scores].sort((a, b) => a - b)).toEqual(scores);
  });
});

describe('도우미 함수', () => {
  it('띄어쓰기를 무시한다', () => {
    expect(normalizeGuess(' 송골 매 ')).toBe('송골매');
  });

  it('유사도를 소수 둘째 자리 퍼센트로 바꾼다', () => {
    expect(formatSimilarity(10000)).toBe('100.00%');
    expect(formatSimilarity(4169)).toBe('41.69%');
    expect(formatSimilarity(-120)).toBe('-1.20%');
  });

  it('가까운 순, 같으면 먼저 추측한 순으로 정렬한다', () => {
    const sorted = sortGuesses([
      { word: 'a', similarity: 10, rank: null, order: 1 },
      { word: 'b', similarity: 30, rank: null, order: 2 },
      { word: 'c', similarity: 30, rank: null, order: 3 },
    ]);
    expect(sorted.map((g) => g.word)).toEqual(['b', 'c', 'a']);
  });
});

describe('생성된 퍼즐 데이터', () => {
  const dir = path.resolve(__dirname, '../../public/hangmentle');
  const realVocab: string[] = JSON.parse(fs.readFileSync(path.join(dir, 'vocab.json'), 'utf8'));

  it('정답 수만큼 퍼즐 파일이 있고, 단어 목록과 길이가 같다', () => {
    for (let n = 1; n <= HANGMENTLE_PUZZLE_COUNT; n += 1) {
      const { sims: puzzleSims } = JSON.parse(fs.readFileSync(path.join(dir, 'puzzles', `${n}.json`), 'utf8'));
      expect(puzzleSims).toHaveLength(realVocab.length);
      expect(Math.max(...puzzleSims)).toBe(10000);
    }
  });
});
