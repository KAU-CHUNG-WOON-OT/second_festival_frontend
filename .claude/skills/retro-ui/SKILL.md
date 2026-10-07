---
name: retro-ui
description: 2026 활주로 축제 프론트의 레트로(카세트·티켓) 디자인 시스템으로 화면·컴포넌트를 만들거나 수정할 때 사용. 새 페이지 추가, 피그마 시안 구현, 기존 UI 스타일 수정, 디자인 리뷰 요청 시 적용.
---

# 레트로 UI 작업 가이드

작업 전에 반드시 `docs/design-system.md`를 읽는다. 토큰·글꼴·카드 공식·공통 컴포넌트·피그마 작업 규칙이 모두 거기 있다.

## 핵심 규칙

1. **토큰만 사용**: 색은 `ink / paper / cream / mustard / rust / tape-blue / sky-light / olive / maroon` (`src/index.css` `@theme`). 임의 hex 금지.
2. **글꼴 역할 고정**: 제목 `font-display`, 영문 라벨·메타 `font-typewriter`, 큰 숫자·시간 `font-condensed`, 본문 `font-body-kr`.
3. **카드 공식**: `rounded-[16px] border-2 border-ink bg-paper` + 흐림 없는 그림자 `drop-shadow-[5px_5px_0px_var(--color-ink)]`. 누르는 카드는 `active:translate-x-[2px] active:translate-y-[2px]`.
4. **페이지 뼈대**: `px-5 pb-16 pt-5 text-ink` 컨테이너 → `<RetroPageHeader />` → `<RetroPageTitle title=… />`. 직접 알약·60px 제목을 다시 만들지 않는다.
5. **새 경로는 `src/layout/Layout.tsx`의 `REDESIGNED_PATHS`에 추가** (푸터 없는 시안이면 `NO_FOOTER_PATHS`도).
6. **줄무늬는 `bg-retro-stripe`**. 그라디언트를 복사하지 않는다.
7. **공통 컴포넌트 우선**: `RetroDialog`, `InfoCard`, `MenuList`, `PaymentCard`, `Poster`, `CategoryList`, `SearchBar`, `TicketStatusCard`, `LoginRequiredPopup`. 새로 만들기 전에 `src/components/common`부터 확인.

## 피그마 시안을 구현할 때

- 파일 key `E7be7Ar25mQ8x1ZDngWtcw`. `get_design_context`로 코드+스크린샷을 같이 받고, 스크린샷을 목표로 삼는다.
- 반환된 절대 위치 코드는 flex 레이아웃으로 바꾸고, hex는 토큰으로 바꾼다.
- 이미지 마스크 SVG는 꽉 찬 사각형이라 무시하고 이미지만 쓴다.
- API 호출, mixpanel `track`, i18n(`t()` / `isEng`) 로직은 건드리지 않고 렌더만 바꾼다.
- 시안이 없는 화면은 가장 비슷한 화면에서 파생한다 (`docs/design-system.md` 7장).

## 마무리 검증

1. `npx -y pnpm@9 build` 통과
2. 브라우저 402px 폭에서 시안과 비교 (dev 서버는 `VITE_MIXPANEL_TOKEN`이 없으면 빈 화면이므로 더미 값을 넣고 실행)
3. 한/영 전환 확인
4. 안 쓰게 된 컴포넌트·에셋·import 삭제
5. `docs/design-system.md` 8장 체크리스트 확인

새 공통 패턴(토큰, 공통 컴포넌트, 유틸리티)을 추가했다면 `docs/design-system.md`도 같이 갱신한다.
