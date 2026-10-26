import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/apiClient';
import type { HangmentleGuessResponse } from '@/lib/api/hangmentle';
import type { HangmentleProgress } from '@/lib/hangmentleProgress';
import {
  HANGMENTLE_EVENT_ROUNDS,
  OPEN_CHECK_SPREAD_MS,
  OPENING_FAST_RETRY_MS,
  PRACTICE_SYNC_LEAD_MS,
  classifyGuessError,
  classifyRoundError,
  findEventRound,
  formatKstTime,
  guessErrorText,
  guessFromResponse,
  isNotSolvedError,
  isPracticeSyncWindow,
  openCheckDelayMs,
  openedWhileWatching,
  practiceSyncRounds,
  practiceSyncStarts,
  resolveEventProgress,
  roundPhase,
  roundPollInterval,
  solveRankText,
  watchClosedRounds,
  type RoundPhaseEntry,
} from './hangmentleEvent';
import { parseServerTime } from './hangmentleClock';

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
    expect(solveRankText(5, false)).toBe('5등으로 맞혔어요!');
    expect(solveRankText(6, false)).toBe('6번째로 맞혔어요.');
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
  it('열리지 않은 회차는 409 GAME-409일 때만', () => {
    expect(classifyGuessError(new ApiError('아직 열리지 않은 문제예요', 409, 'GAME-409'))).toBe(
      'notOpen',
    );
    // 다른 409·403은 '아직 안 열림'이 아니다
    expect(classifyGuessError(new ApiError('이미 가입된 학번입니다.', 409, 'USER-409'))).toBe(
      'server',
    );
    expect(classifyGuessError(new ApiError('접근 권한이 없습니다.', 403, 'AUTH-403'))).toBe(
      'server',
    );
  });

  it('로그인 만료(401), 너무 많은 추측(429), 잘못된 입력(400), 준비 중(503), 없는 회차(404)', () => {
    expect(classifyGuessError(new ApiError('만료된 토큰입니다.', 401, 'AUTH-403'))).toBe('auth');
    expect(classifyGuessError(new ApiError('잠시 후 다시 시도해 주세요', 429, 'GAME-429'))).toBe(
      'tooMany',
    );
    expect(classifyGuessError(new ApiError('word: 단어는 50자 이하', 400, 'COMMON-400'))).toBe(
      'invalid',
    );
    expect(classifyGuessError(new ApiError('문제를 준비하고 있어요', 503, 'GAME-503'))).toBe(
      'notReady',
    );
    expect(classifyGuessError(new ApiError('존재하지 않는 문제예요', 404, 'GAME-404'))).toBe(
      'notFound',
    );
    expect(classifyGuessError(new ApiError('요청한 주소를 찾을 수 없습니다.', 404, 'COMMON-404'))).toBe(
      'server',
    );
    expect(classifyGuessError(new ApiError('서버 오류', 500, 'COMMON-500'))).toBe('server');
  });

  it('서버에 닿지 못한 오류는 연결 문제', () => {
    expect(classifyGuessError(new TypeError('Failed to fetch'))).toBe('network');
  });

  it('오류마다 짧은 안내 문구가 있다', () => {
    expect(guessErrorText('notOpen', false)).toBe('아직 열리지 않은 문제입니다.');
    expect(guessErrorText('network', false)).toBe('연결이 불안정합니다. 다시 시도해 주세요.');
    expect(guessErrorText('server', true)).toBe('Something went wrong. Please try again.');
    expect(guessErrorText('invalid', false)).toBe('단어를 확인해 주세요. 50자까지 입력할 수 있습니다.');
  });

  it('429는 서버 문구를 그대로, 없으면 기본 문구', () => {
    expect(guessErrorText('tooMany', false, '1분에 30번까지 추측할 수 있어요')).toBe(
      '1분에 30번까지 추측할 수 있어요',
    );
    expect(guessErrorText('tooMany', false, '  ')).toBe(
      '너무 빨리 추측하고 있습니다. 잠시 후 다시 시도해 주세요.',
    );
    expect(guessErrorText('tooMany', true, '한국어 문구')).toBe(
      'Too many guesses. Please wait a moment and try again.',
    );
  });
});

describe('classifyRoundError', () => {
  it('404 GAME-404만 없는 문제, 나머지는 다시 시도', () => {
    expect(classifyRoundError(new ApiError('존재하지 않는 문제예요', 404, 'GAME-404'))).toBe(
      'notFound',
    );
    expect(classifyRoundError(new ApiError('Not Found', 404))).toBe('failed');
    expect(classifyRoundError(new ApiError('서버 오류', 500, 'COMMON-500'))).toBe('failed');
    expect(classifyRoundError(new TypeError('Failed to fetch'))).toBe('failed');
  });
});

describe('isNotSolvedError', () => {
  it('403 GAME-403만 아직 안 맞힘 (다시 묻지 않는다)', () => {
    expect(isNotSolvedError(new ApiError('정답을 맞힌 뒤에 볼 수 있어요', 403, 'GAME-403'))).toBe(
      true,
    );
    expect(isNotSolvedError(new ApiError('권한 없음', 403, 'AUTH-403'))).toBe(false);
    expect(isNotSolvedError(new ApiError('서버 오류', 500, 'COMMON-500'))).toBe(false);
    expect(isNotSolvedError(new TypeError('Failed to fetch'))).toBe(false);
    expect(isNotSolvedError(null)).toBe(false);
  });
});

describe('roundPhase · roundPollInterval', () => {
  const HINTS = { first: 4200, tenth: 3300, thousandth: 1900 };
  const OPENS_AT = '2026-10-28T22:00:00';
  const opensAtMs = parseServerTime(OPENS_AT)!;
  const closed = { open: false, opensAt: OPENS_AT, hints: HINTS };

  it('열리기 전에는 카운트다운, 열린 뒤에도 서버가 닫혀 있다고 하면 곧 열림', () => {
    expect(roundPhase(closed, opensAtMs - 1)).toBe('countdown');
    expect(roundPhase(closed, opensAtMs)).toBe('opening');
    expect(roundPhase(closed, opensAtMs + 3000)).toBe('opening');
  });

  it('서버가 열렸다고 하면 시계와 상관없이 연다', () => {
    expect(roundPhase({ ...closed, open: true }, opensAtMs - 5000)).toBe('open');
    expect(roundPhase({ ...closed, open: true }, opensAtMs + 5000)).toBe('open');
  });

  it('힌트가 없으면 준비 중. 열릴 시각이 지났으면 곧 열린다고 하지 않는다', () => {
    // 열리기 전이면 카운트다운은 그대로 (시각은 정해져 있으므로)
    expect(roundPhase({ ...closed, hints: null }, opensAtMs - 1000)).toBe('countdown');
    expect(roundPhase({ ...closed, hints: null }, opensAtMs + 1000)).toBe('notReady');
    expect(roundPhase({ open: true, opensAt: OPENS_AT, hints: null }, opensAtMs + 1000)).toBe(
      'notReady',
    );
  });

  it('열리는 시각이 없으면 closed', () => {
    expect(roundPhase({ open: false, opensAt: null, hints: HINTS }, opensAtMs)).toBe('closed');
    expect(roundPhase({ open: false, opensAt: null, hints: null }, opensAtMs)).toBe('notReady');
  });

  it('곧 열림 상태에서는 처음 몇 초 동안 1초마다, 그 뒤로는 느리게 다시 묻는다', () => {
    expect(roundPollInterval(closed, opensAtMs + 10)).toBe(1000);
    expect(roundPollInterval(closed, opensAtMs + OPENING_FAST_RETRY_MS - 1)).toBe(1000);
    expect(roundPollInterval(closed, opensAtMs + OPENING_FAST_RETRY_MS)).toBe(5000);
  });

  it('열려서 풀 수 있으면 더 묻지 않고, 열리기 전·준비 중에는 가끔 묻는다', () => {
    expect(roundPollInterval({ ...closed, open: true }, opensAtMs + 10)).toBe(false);
    expect(roundPollInterval(closed, opensAtMs - 60_000)).toBe(60_000);
    expect(roundPollInterval({ ...closed, open: true, hints: null }, opensAtMs)).toBe(10_000);
  });

  it('기기마다 늦춘 시간(delayMs)만큼 카운트다운에 머물렀다가 묻기 시작한다', () => {
    expect(roundPhase(closed, opensAtMs + 500, 800)).toBe('countdown');
    expect(roundPhase(closed, opensAtMs + 800, 800)).toBe('opening');
    expect(roundPollInterval(closed, opensAtMs + 500, 800)).toBe(60_000);
    expect(roundPollInterval(closed, opensAtMs + 800 + OPENING_FAST_RETRY_MS - 1, 800)).toBe(1000);
    expect(roundPollInterval(closed, opensAtMs + 800 + OPENING_FAST_RETRY_MS, 800)).toBe(5000);
    // 서버가 열렸다고 하면 늦추지 않는다
    expect(roundPhase({ ...closed, open: true }, opensAtMs, 800)).toBe('open');
  });

  it('늦추는 시간은 0 이상 1초 미만', () => {
    expect(OPEN_CHECK_SPREAD_MS).toBe(1000);
    expect(openCheckDelayMs).toBeGreaterThanOrEqual(0);
    expect(openCheckDelayMs).toBeLessThan(OPEN_CHECK_SPREAD_MS);
  });
});

describe('watchClosedRounds · openedWhileWatching', () => {
  const entries = (p1: RoundPhaseEntry['phase'], p2: RoundPhaseEntry['phase']) => [
    { round: 1, phase: p1 },
    { round: 2, phase: p2 },
  ];

  it('열리기 전으로 본 회차만 기억하고, 바뀐 게 없으면 같은 배열', () => {
    const watched = watchClosedRounds([], entries('countdown', 'countdown'));
    expect(watched).toEqual([1, 2]);
    expect(watchClosedRounds(watched, entries('countdown', 'countdown'))).toBe(watched);
    // 이미 열린 회차는 기억하지 않는다 (열린 뒤에 들어온 화면에서는 데려가지 않음)
    expect(watchClosedRounds([], entries('open', null))).toEqual([]);
  });

  it('기억한 회차가 열리거나 열릴 시각이 지나면 그 회차', () => {
    expect(openedWhileWatching([1, 2], entries('countdown', 'countdown'))).toBeNull();
    expect(openedWhileWatching([1, 2], entries('opening', 'countdown'))).toBe(1);
    expect(openedWhileWatching([1, 2], entries('open', 'countdown'))).toBe(1);
    expect(openedWhileWatching([2], entries('open', 'countdown'))).toBeNull();
    expect(openedWhileWatching([1, 2], entries('open', 'open'))).toBe(2);
  });

  it('닫은 안내(ignore)는 빼고, 상태를 모르면 열렸다고 보지 않는다', () => {
    expect(openedWhileWatching([1, 2], entries('open', 'open'), [2])).toBe(1);
    expect(openedWhileWatching([1], entries(null, null))).toBeNull();
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
    expect(HANGMENTLE_EVENT_ROUNDS.map((r) => [r.round, r.label, r.title])).toEqual([
      [1, '10시', '10시 문제'],
      [2, '11시', '11시 문제'],
    ]);
    expect(HANGMENTLE_EVENT_ROUNDS.map((r) => formatKstTime(r.scheduledAt, false))).toEqual([
      '22:00',
      '23:00',
    ]);
  });

  it('번호로 회차를 찾는다', () => {
    expect(findEventRound(2)?.label).toBe('11시');
    expect(findEventRound(3)).toBeNull();
  });
});

describe('연습 화면의 회차 요약 받기 (practiceSyncRounds · isPracticeSyncWindow)', () => {
  const at10 = parseServerTime('2026-10-28T22:00:00')!;
  const at11 = parseServerTime('2026-10-28T23:00:00')!;
  const info = (round: number, open: boolean, opensAt: string | null) => ({
    round,
    open,
    opensAt,
    hints: null,
    serverTime: '2026-10-28T21:00:00',
  });
  const overview = (r1: ReturnType<typeof info>, r2: ReturnType<typeof info>) => ({
    rounds: [r1, r2],
  });

  it('요약을 받기 전에는 예정 시각(10시·11시), 아직 안 열린 것으로 본다', () => {
    expect(practiceSyncRounds(undefined)).toEqual([
      { opensAtMs: at10, open: false },
      { opensAtMs: at11, open: false },
    ]);
  });

  it('요약을 받았으면 서버의 열리는 시각·열림을 쓰고, 시각이 비어 있으면 예정 시각', () => {
    const rounds = practiceSyncRounds(
      overview(info(1, true, '2026-10-28T21:30:00'), info(2, false, null)),
    );
    expect(rounds).toEqual([
      { opensAtMs: parseServerTime('2026-10-28T21:30:00'), open: true },
      { opensAtMs: at11, open: false },
    ]);
  });

  it('열리기 5분 전부터 받는다 (그 전에는 받지 않음)', () => {
    const rounds = practiceSyncRounds(undefined);
    expect(PRACTICE_SYNC_LEAD_MS).toBe(5 * 60_000);
    // 이벤트와 먼 날(사흘 전)·5분 1초 전
    expect(isPracticeSyncWindow(rounds, at10 - 3 * 86_400_000)).toBe(false);
    expect(isPracticeSyncWindow(rounds, at10 - PRACTICE_SYNC_LEAD_MS - 1000)).toBe(false);
    expect(isPracticeSyncWindow(rounds, at10 - PRACTICE_SYNC_LEAD_MS)).toBe(true);
    expect(isPracticeSyncWindow(rounds, at10 + 3000)).toBe(true);
  });

  it('서버가 열렸다고 하면 그 회차 때문에는 더 받지 않고, 다음 회차 5분 전에 다시 받는다', () => {
    const tenOpen = practiceSyncRounds(
      overview(info(1, true, '2026-10-28T22:00:00'), info(2, false, '2026-10-28T23:00:00')),
    );
    expect(isPracticeSyncWindow(tenOpen, at10 + 1000)).toBe(false);
    expect(isPracticeSyncWindow(tenOpen, at11 - PRACTICE_SYNC_LEAD_MS - 1)).toBe(false);
    expect(isPracticeSyncWindow(tenOpen, at11 - PRACTICE_SYNC_LEAD_MS)).toBe(true);
    const bothOpen = practiceSyncRounds(
      overview(info(1, true, '2026-10-28T22:00:00'), info(2, true, '2026-10-28T23:00:00')),
    );
    expect(isPracticeSyncWindow(bothOpen, at11 + 60_000)).toBe(false);
  });

  it('서버가 열리는 시각을 바꾸면 그 시각 5분 전부터', () => {
    const moved = practiceSyncRounds(
      overview(info(1, false, '2026-10-28T22:30:00'), info(2, false, '2026-10-28T23:00:00')),
    );
    const at1030 = parseServerTime('2026-10-28T22:30:00')!;
    expect(isPracticeSyncWindow(moved, at10 - PRACTICE_SYNC_LEAD_MS)).toBe(false);
    expect(isPracticeSyncWindow(moved, at1030 - PRACTICE_SYNC_LEAD_MS)).toBe(true);
  });

  it('받기 시작할 시각은 아직 안 열린 회차만 (화면을 다시 그릴 때로 쓴다)', () => {
    expect(practiceSyncStarts(practiceSyncRounds(undefined))).toEqual([
      at10 - PRACTICE_SYNC_LEAD_MS,
      at11 - PRACTICE_SYNC_LEAD_MS,
    ]);
    expect(
      practiceSyncStarts(
        practiceSyncRounds(
          overview(info(1, true, '2026-10-28T22:00:00'), info(2, false, '2026-10-28T23:00:00')),
        ),
      ),
    ).toEqual([at11 - PRACTICE_SYNC_LEAD_MS]);
  });
});
