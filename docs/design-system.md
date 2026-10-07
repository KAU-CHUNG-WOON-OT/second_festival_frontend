# 레트로 디자인 시스템 (2026 활주로)

> 피그마: [2026 활주로상권](https://www.figma.com/design/E7be7Ar25mQ8x1ZDngWtcw/2026-%ED%99%9C%EC%A3%BC%EB%A1%9C%EC%83%81%EA%B6%8C?node-id=0-1) (file key `E7be7Ar25mQ8x1ZDngWtcw`)
>
> 콘셉트: **카세트테이프 · 비행기 티켓 · LP** 레트로. 진한 갈색 테두리와 흐림 없는 그림자로 "종이 스티커" 느낌을 낸다.

새 화면을 만들거나 기존 화면을 고칠 때는 **아래 토큰과 공통 컴포넌트를 먼저 쓰고**, 임의 색상(hex)이나 새 글꼴을 추가하지 않는다.

---

## 1. 색상 토큰

`src/index.css`의 `@theme`에 정의. Tailwind 클래스로 쓴다 (`bg-ink`, `text-rust`, `border-ink/50` …).

| 토큰 | 값 | 용도 |
|---|---|---|
| `ink` | `#2a1810` | 글자, 모든 테두리, 하드 그림자, 진한 버튼·띠 |
| `paper` | `#fbf3df` | 카드 배경, 진한 배경 위 글자 |
| `cream` | `#f4e7cc` | 페이지 배경(Layout), 입력창, 펀치 구멍 |
| `mustard` | `#e3a62b` | "활주로" 알약, 아이콘 박스, 강조 카드, 다이얼로그 그림자 |
| `rust` | `#c4491c` | 포인트: NEW 뱃지, 주요 CTA, 강조 제목, 에러 테두리 |
| `tape-blue` | `#3f8fc9` | SCHEDULED 뱃지, 트랙 번호, 링크성 정보 |
| `sky-light` | `#8ec9ee` | 줄무늬 3번째 색, 보조 카드 |
| `olive` | `#6d6a2c` | 보조 카드 (홈 바로가기 등) |
| `maroon` | `#6b2d2a` | LP 재킷 배경 같은 어두운 면 |

- 투명도는 `/숫자`로: `text-ink/60` (메타 정보), `border-ink/50` (점선), `bg-ink/70` (모달 배경)
- 예외: 카카오 노랑 `#fee500`, 비회원 버튼 `#2750b9` (온보딩만)

## 2. 글꼴 역할

`index.html`에서 Google Fonts로 로드. **역할을 섞지 않는다.**

| 클래스 | 글꼴 | 쓰는 곳 | 예 |
|---|---|---|---|
| `font-display` | Black Han Sans | 페이지 제목, 카드 제목, 이름, 버튼 | `타임테이블`, `총학생회` |
| `font-typewriter` | Courier Prime | 영문 라벨, 메타데이터, 뱃지, 날짜 | `SIDE A · TRACK LIST`, `TRACK`, `STAGE`, `NEW` |
| `font-condensed` | Big Shoulders Display | 큰 숫자, 시간 | `11:00`, 대기번호 `43` |
| `font-body-kr` | Noto Sans KR | 본문, 설명, 입력값 | 공지 내용, 안내 문구 |

자주 쓰는 크기:

- 페이지 제목 `font-display text-[60px] leading-[60px]`
- 카드 제목 `font-display text-[20px] leading-7`
- 타자기 부제 `font-typewriter text-[12px] leading-4 tracking-[3.6px]` (글자 간격을 넓게)
- 라벨 `font-typewriter text-[12px] leading-4 opacity-60`
- 본문 `font-body-kr text-[14px] leading-5 opacity-70`

## 3. 카드 공식

거의 모든 카드가 이 조합이다.

```tsx
<div className="rounded-[16px] border-2 border-ink bg-paper p-5 drop-shadow-[5px_5px_0px_var(--color-ink)]">
```

| 요소 | 규칙 |
|---|---|
| 테두리 | 카드 `border-2 border-ink`, 작은 칩·아이콘 박스 `border border-ink` |
| 그림자 | **흐림 0** 하드 그림자. 작은 버튼 3px, 버튼·작은 카드 4px, 카드 5px, 큰 카드 6px, 히어로 8px |
| 모서리 | 카드 `16px`, 큰 카드·폼 `24px`, 아이콘 박스 `12px`, 뱃지 `4px` 또는 `full` |
| 눌림 | 누를 수 있는 카드는 `transition-transform active:translate-x-[2px] active:translate-y-[2px]` |

- 그림자 색은 기본 `ink`, 진한 배경 위 모달은 `mustard`, 강조 버튼은 `rust`로 바꿔도 된다.
- `drop-shadow-[...]`를 기본으로 쓴다(자식 모양을 따라감). `overflow-clip` 카드처럼 박스 그림자가 필요하면 `shadow-[6px_6px_0px_0px_var(--color-ink)]`.

## 4. 페이지 뼈대

```tsx
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';

<div className="flex flex-col px-5 pb-16 pt-5 text-ink">
  <RetroPageHeader />                                  {/* ← 뒤로가기 + 청운 로고 */}
  <RetroPageTitle title="타임테이블" caption="SIDE A · TRACK LIST" />
  {/* 본문은 pt-6 / mt-6 간격으로 쌓는다 */}
</div>
```

| 컴포넌트 | props | 설명 |
|---|---|---|
| `RetroPageHeader` | `title?` | 둥근 뒤로가기 버튼, (선택) 가운데 제목, 청운 로고 |
| `RetroPageTitle` | `title`, `showDate?`, `caption?`, `aside?` | 겨자색 알약 "활주로(· 10.28 WED)" → 60px 제목 → 타자기 부제. `aside`는 제목 오른쪽 요소(새로고침 버튼 등) |

새 페이지를 추가하면 **`src/layout/Layout.tsx`의 `REDESIGNED_PATHS`에 경로를 꼭 추가**한다. 그래야 예전 Header·SkyDots가 숨고, 크림 배경과 `RetroFooter`가 적용된다. 푸터가 없는 시안이면 `NO_FOOTER_PATHS`에도 넣는다.

## 5. 반복 장식 모티프

| 모티프 | 코드 | 쓰인 곳 |
|---|---|---|
| 3색 줄무늬 | `<div className="h-2 w-full bg-retro-stripe" />` (`index.css`의 `@utility`) | 푸터, 홈 히어로, 온보딩, 타임테이블 모달 |
| 티켓 펀치 구멍 | 카드 양옆 `absolute -left-[10px] size-5 rounded-full border border-ink bg-cream` | TrackCard, 홈 게임 카드 |
| 절취선 | `border-t border-dashed border-ink/50` | 카드 상·하단 구분 |
| 카세트 릴 | `assets/cassette_reel.svg`, `assets/home_reel.svg` | 온보딩, 라인업, 공연 중 카드 |
| LP 레코드 | `TimetableModal` 상단 | 공연 상세 |
| 타자기 라벨 | `SIDE A`, `TRACK A-01`, `BOARDING PASS`, `33⅓ RPM` | 영문 부제·메타 |

뱃지:

```tsx
// NEW
<span className="rounded-full border border-ink bg-rust px-3 py-[2px] font-typewriter text-[12px] font-bold leading-4 text-paper">NEW</span>
// 상태 (SCHEDULED / DONE)
<span className="rounded-[4px] bg-tape-blue px-2 py-1 font-typewriter text-[11px] font-bold text-paper">SCHEDULED</span>
```

## 6. 공통 컴포넌트

| 컴포넌트 | 위치 | 언제 쓰나 |
|---|---|---|
| `RetroDialog` | `components/common` | 가운데 확대 보기 모달 (지도·포스터·QR). `title`, `onClose`, `children` |
| `LoginRequiredPopup` | `components/common` | 로그인 필요 안내 |
| `InfoCard` | `components/common` | 위치·시간 등 정보 행. `highlight`, `title`, `titleAction`로 강조 카드 |
| `MenuList` | `components/common` | 메뉴·판매 항목 + 좋아요 |
| `PaymentCard` | `components/common` | 계좌 복사 + QR 확대 |
| `Poster` | `components/common` | 포스터 이미지 + 확대, 로드 실패 시 로고 대체 |
| `CategoryList`, `SearchBar` | `components/common` | 목록 필터 |
| `RetroFooter` | `layout` | Layout이 자동 렌더. 홈만 `large` |

아래에서 올라오는 시트(공지 상세 `NoticeModal`, 공연 상세 `TimetableModal`)는 `rounded-t-[32px] border-2 border-ink` + 슬라이드업 애니메이션 + 아래로 끌어서 닫기 구조다. 새 시트가 필요하면 둘 중 하나를 참고한다.

## 7. 피그마 → 코드 작업 규칙

1. **시안 확인**: `get_design_context`로 노드 코드와 스크린샷을 같이 받는다. 스크린샷이 목표 결과물이다.
2. **토큰으로 변환**: 시안의 hex를 위 토큰으로 바꾼다. 매칭이 안 되는 색이 나오면 새 토큰을 만들기 전에 팀에 확인한다.
3. **마스크 SVG는 무시**: 이 파일의 이미지 마스크는 전부 꽉 찬 사각형이라 의미가 없다. 이미지 자체만 쓴다.
4. **로직은 유지, 렌더만 교체**: API 호출, mixpanel `track`, i18n(`t()`/`isEng`)은 그대로 두고 JSX·클래스만 바꾼다.
5. **시안이 없는 화면**은 가장 비슷한 화면에서 파생한다. 예: 주점·푸드트럭 ← 부스, 공연 ← 타임테이블, 정보입력 ← 온보딩.
6. **이미지 실패 대비**: 서버 이미지는 `onError`에서 `cheongun_logo.svg`로 대체한다.
7. **정리**: 바꾸면서 안 쓰게 된 컴포넌트·에셋·import는 같이 삭제한다.
8. **검증**: 브라우저를 **402px 폭**으로 맞추고 피그마 스크린샷과 나란히 비교한다.

## 8. 체크리스트

- [ ] 색은 토큰만 썼다 (임의 hex 없음, 카카오 예외만 허용)
- [ ] 글꼴 역할을 지켰다 (제목 display / 라벨 typewriter / 숫자 condensed / 본문 body-kr)
- [ ] 카드는 `border-2 border-ink` + 하드 그림자
- [ ] 페이지는 `RetroPageHeader` + `RetroPageTitle`로 시작
- [ ] 새 경로를 `REDESIGNED_PATHS`에 추가했다
- [ ] 줄무늬는 `bg-retro-stripe`, 직접 그라디언트를 쓰지 않았다
- [ ] 한/영 전환(`isEng` 또는 `t()`) 확인
- [ ] 402px 폭에서 시안과 비교했다
- [ ] `pnpm build` 통과
