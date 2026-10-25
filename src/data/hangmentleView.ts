// 항멘틀 화면 이동: 주소 쿼리에 담아 상단 뒤로가기·브라우저 뒤로가기·링크 공유가 그대로 되게 한다
// 이벤트 안내(허브) = 쿼리 없음, 회차 = ?round=1, 연습 = ?view=practice(&puzzle=2)
import { HANGMENTLE_PRACTICE_SLOTS } from './hangmentleData';
import { findEventRound } from './hangmentleEvent';

export type HangmentleView =
  | { kind: 'hub' }
  | { kind: 'round'; round: number }
  | { kind: 'practice'; puzzleNo: number };

// 항멘틀이 쓰는 쿼리 키. 다른 쿼리(utm 등)는 건드리지 않는다
const VIEW_KEYS = ['round', 'view', 'puzzle'] as const;

// 항멘틀 안쪽 화면(회차·연습)을 가리키는 쿼리가 있는지 (?utm_source=… 같은 다른 쿼리만 있으면 false)
export const hasHangmentleViewKey = (params: URLSearchParams) =>
  VIEW_KEYS.some((key) => params.has(key));

const toWholeNumber = (value: string | null) =>
  value !== null && /^\d+$/.test(value) ? Number(value) : null;

export const parseHangmentleView = (params: URLSearchParams): HangmentleView => {
  if (params.get('view') === 'practice') {
    const puzzleNo = toWholeNumber(params.get('puzzle'));
    return {
      kind: 'practice',
      puzzleNo: puzzleNo !== null && puzzleNo >= 1 && puzzleNo <= HANGMENTLE_PRACTICE_SLOTS ? puzzleNo : 1,
    };
  }
  const round = toWholeNumber(params.get('round'));
  if (round !== null && findEventRound(round) !== null) {
    return { kind: 'round', round };
  }
  return { kind: 'hub' };
};

// 화면에 맞는 쿼리. base의 다른 쿼리는 그대로 둔다
export const hangmentleViewParams = (view: HangmentleView, base?: URLSearchParams) => {
  const next = new URLSearchParams(base);
  VIEW_KEYS.forEach((key) => next.delete(key));
  if (view.kind === 'round') next.set('round', String(view.round));
  if (view.kind === 'practice') {
    next.set('view', 'practice');
    if (view.puzzleNo !== 1) next.set('puzzle', String(view.puzzleNo));
  }
  return next;
};

// 없는 회차(?round=9)·잘못된 값은 주소를 고쳐 쓴다 (기록을 늘리지 않고 바꿔치기)
export const isCanonicalHangmentleView = (params: URLSearchParams) =>
  hangmentleViewParams(parseHangmentleView(params), params).toString() === params.toString();

// 화면이 바뀌었는지 비교하는 키 (연습 문제 번호만 바뀐 건 같은 화면)
export const hangmentleViewKey = (view: HangmentleView) =>
  view.kind === 'round' ? `round-${view.round}` : view.kind;
