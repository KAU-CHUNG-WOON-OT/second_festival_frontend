// 화면 위에 고정되는 RetroPageHeader의 높이(위 여백 20px + 버튼 줄 44px).
// 그 아래에 따로 붙는 영역(항멘틀 힌트·입력창 등)은 이 값만큼 내려서 붙인다
export const RETRO_HEADER_HEIGHT = 64;

// 상단바 바로 아래에 붙는 띠(목록 필터·검색창, 항멘틀 힌트·입력창)의 top. 1px 겹쳐 붙는 순간을 감지한다
export const STICKY_BAND_TOP = RETRO_HEADER_HEIGHT - 1;

// 고정 영역 뒤에 깔 노을 하늘. 고정 영역은 화면 기준 offsetTop 위치에 있으므로
// 하늘을 그만큼 끌어올려 깔면 뒤 하늘과 정확히 겹쳐 경계가 보이지 않는다.
// 위치가 스크롤에 따라 바뀌면 CSS 값(예: 'var(--band-top)')으로 넘긴다
export const skyBackground = (offsetTop: number | string = 0) => {
  const offset = typeof offsetTop === 'number' ? `${offsetTop}px` : offsetTop;
  return `var(--gradient-retro-dusk) 0 calc(-1 * ${offset}) / 100% 100dvh no-repeat`;
};
