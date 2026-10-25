import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/apiClient';
import type { HangmentleGuessResponse } from '@/lib/api/hangmentle';
import type { HangmentleProgress } from '@/lib/hangmentleProgress';
import {
  HANGMENTLE_EVENT_ROUNDS,
  classifyGuessError,
  formatKstTime,
  guessErrorText,
  guessFromResponse,
  resolveEventProgress,
  solveRankText,
} from './hangmentleEvent';

// 실제 이벤트 정답과 상관없는 가짜 단어만 쓴다
const response = (patch: Partial<HangmentleGuessResponse>): HangmentleGuessResponse => ({
  word: '사과',
  known: true,
  similarity: 2345,
  similarityRank: 120,
  correct: false,
  solved: null,
  ...patch,
});

describe('formatKstTime', () => {
  it('오프셋 없는 서버 시각(서울)은 그대로 읽는다', () => {
    expect(formatKstTime('2026-10-25T22:03:07.123456')).toBe('22:03:07');
    expect(formatKstTime('2026-10-25T22:03:07')).toBe('22:03:07');
    expect(formatKstTime('2026-10-25T09:05')).toBe('09:05:00');
  });

  it('오프셋이 있으면 서울 시각으로 바꾼다', () => {
    expect(formatKstTime('2026-10-25T13:03:07Z')).toBe('22:03:07');
    expect(formatKstTime('2026-10-25T22:03:07+09:00')).toBe('22:03:07');
    expect(formatKstTime('2026-10-25T15:30:00.5Z')).toBe('00:30:00');
  });

  it('초를 빼고 시:분만 보여 줄 수 있다', () => {
    expect(formatKstTime('2026-10-25T22:00:00', false)).toBe('22:00');
    expect(formatKstTime('2026-10-25T13:00:00Z', false)).toBe('22:00');
  });

  it('읽을 수 없는 값은 빈 문자열', () => {
    expect(formatKstTime('어제')).toBe('');
  });
});

describe('solveRankText', () => {
  it('랭킹 안이면 n등, 밖이면 n번째', () => {
    expect(solveRankText(1, false)).toBe('1등으로 맞혔어요!');
    expect(solveRankText(10, false)).toBe('10등으로 맞혔어요!');
    expect(solveRankText(11, false)).toBe('11번째로 맞혔어요');
  });

  it('영어는 서수로 쓴다', () => {
    expect(solveRankText(3, true)).toBe('You placed 3rd!');
    expect(solveRankText(12, true)).toBe('You were the 12th to solve it');
    expect(solveRankText(21, true)).toBe('You were the 21st to solve it');
  });
});

describe('guessFromResponse', () => {
  it('서버 유사도·순위를 목록 한 줄로 바꾼다', () => {
    expect(guessFromResponse(response({}), 3)).toEqual({
      word: '사과',
      similarity: 2345,
      rank: 120,
      order: 3,
    });
  });

  it('1000위 밖은 순위 null', () => {
    expect(guessFromResponse(response({ similarityRank: null }), 1)?.rank).toBeNull();
  });

  it('정답은 순위 0, 유사도 10000', () => {
    const guess = guessFromResponse(
      response({
        correct: true,
        similarity: 10000,
        similarityRank: null,
        solved: { rank: 2, solvedAt: '2026-10-25T22:01:00' },
      }),
      5,
    );
    expect(guess).toEqual({ word: '사과', similarity: 10000, rank: 0, order: 5 });
  });

  it('모르는 단어는 null', () => {
    expect(
      guessFromResponse(response({ known: false, similarity: null, similarityRank: null }), 1),
    ).toBeNull();
  });
});

describe('classifyGuessError', () => {
  it('열리지 않은 회차(403·409), 로그인 만료(401), 서버 오류를 구분한다', () => {
    expect(classifyGuessError(new ApiError('아직 열리지 않은 문제예요', 403, 'GAME-403'))).toBe(
      'notOpen',
    );
    expect(classifyGuessError(new ApiError('아직 열리지 않은 문제예요', 409, 'GAME-409'))).toBe(
      'notOpen',
    );
    expect(classifyGuessError(new ApiError('만료된 토큰입니다.', 401, 'AUTH-403'))).toBe('auth');
    expect(classifyGuessError(new ApiError('서버 오류', 500, 'COMMON-500'))).toBe('server');
  });

  it('서버에 닿지 못한 오류는 연결 문제', () => {
    expect(classifyGuessError(new TypeError('Failed to fetch'))).toBe('network');
  });

  it('오류마다 짧은 안내 문구가 있다', () => {
    expect(guessErrorText('notOpen', false)).toBe('아직 열리지 않은 문제예요');
    expect(guessErrorText('network', false)).toBe('연결이 불안정해요. 다시 시도해 주세요');
    expect(guessErrorText('server', true)).toBe('Something went wrong. Please try again.');
  });
});

describe('resolveEventProgress', () => {
  const playing: HangmentleProgress = {
    guesses: [{ word: '사과', similarity: 2345, rank: 120, order: 1 }],
    status: 'playing',
  };
  const solved: HangmentleProgress = {
    guesses: [...playing.guesses, { word: '바나나', similarity: 10000, rank: 0, order: 2 }],
    status: 'solved',
  };

  it('서버 기록이 아직 없으면 기기 기록을 그대로 쓴다', () => {
    expect(resolveEventProgress(playing, undefined)).toBe(playing);
    expect(resolveEventProgress(solved, undefined)).toBe(solved);
  });

  it('다른 기기에서 맞혔으면 맞힌 상태로 되살린다', () => {
    const restored = resolveEventProgress(playing, {
      solved: true,
      rank: 4,
      solvedAt: '2026-10-25T22:10:00',
    });
    expect(restored.status).toBe('solved');
    expect(restored.guesses).toEqual(playing.guesses);
  });

  it('서버는 안 맞혔다는데 기기에 맞힌 기록이 있으면 버린다 (다른 계정 기록)', () => {
    expect(resolveEventProgress(solved, { solved: false, rank: null, solvedAt: null })).toEqual({
      guesses: [],
      status: 'playing',
    });
  });

  it('진행 중 기록은 서버가 안 맞혔다고 해도 이어서 푼다', () => {
    expect(resolveEventProgress(playing, { solved: false, rank: null, solvedAt: null })).toBe(
      playing,
    );
  });
});

describe('HANGMENTLE_EVENT_ROUNDS', () => {
  it('1회차는 10시, 2회차는 11시', () => {
    expect(HANGMENTLE_EVENT_ROUNDS.map((r) => [r.round, r.label])).toEqual([
      [1, '10시'],
      [2, '11시'],
    ]);
  });
});
