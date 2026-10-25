# 레트로 디자인 시스템 (2026 활주로)

> 피그마: [2026 활주로상권](https://www.figma.com/design/E7be7Ar25mQ8x1ZDngWtcw/2026-%ED%99%9C%EC%A3%BC%EB%A1%9C%EC%83%81%EA%B6%8C?node-id=0-1) (file key `E7be7Ar25mQ8x1ZDngWtcw`)
>
> 콘셉트: **카세트테이프 · 비행기 티켓 · LP** 레트로. 진한 갈색 테두리와 흐림 없는 그림자로 "종이 스티커" 느낌을 낸다. 페이지 배경은 별이 뜬 **노을 하늘**(dusk → rust → mustard → paper)이고, 그 위에 흰 헤더·얇은 큰 제목을 올린다.

새 화면을 만들거나 기존 화면을 고칠 때는 **아래 토큰과 공통 컴포넌트를 먼저 쓰고**, 임의 색상(hex)이나 새 글꼴을 추가하지 않는다.

---

## 1. 색상 토큰

`src/index.css`의 `@theme`에 정의. Tailwind 클래스로 쓴다 (`bg-ink`, `text-rust`, `border-ink/50` …).

| 토큰 | 값 | 용도 |
|---|---|---|
| `ink` | `#2a1810` | 글자, 모든 테두리, 하드 그림자, 진한 버튼·띠 |
| `paper` | `#fbf3df` | 카드 배경, 노을 배경 위 글자, 노을이 끝난 아래쪽 배경·푸터 |
| `cream` | `#f4e7cc` | 입력창, 펀치 구멍, 푸터 아이콘 박스 |
| `mustard` | `#e3a62b` | "활주로" 알약, 아이콘 박스, 강조 카드, 다이얼로그 그림자 |
| `rust` | `#c4491c` | 포인트: NEW 뱃지, 주요 CTA, 강조 제목, 에러 테두리 |
| `tape-blue` | `#3f8fc9` | SCHEDULED 뱃지, 트랙 번호, 링크성 정보 |
| `sky-light` | `#8ec9ee` | 줄무늬 3번째 색, 보조 카드 |
| `olive` | `#6d6a2c` | 보조 카드 (홈 바로가기 등) |
| `maroon` | `#6b2d2a` | LP 재킷 배경 같은 어두운 면, 노을 2번째 색 |
| `dusk` | `#4a1f24` | 노을 하늘 맨 위 (가장 어두운 색) |

- 투명도는 `/숫자`로: `text-ink/60` (메타 정보), `border-ink/50` (점선), `bg-ink/70` (모달 배경)
- 노을 그라디언트는 `--gradient-retro-dusk` 변수 하나로 정의돼 있다. 페이지 배경은 Layout이 깔아 주므로 페이지·섹션에 배경색을 따로 칠하지 않는다
- 예외: 카카오 노랑 `#fee500`, 비회원 버튼 `#2750b9` (온보딩만)

## 2. 글꼴 역할

`index.html`에서 Google Fonts로 로드. **역할을 섞지 않는다.**

| 클래스 | 글꼴 | 쓰는 곳 | 예 |
|---|---|---|---|
| `font-sans font-light` | Pretendard | 노을 배경 위 페이지 큰 제목 (`RetroPageTitle`) | `타임테이블`, `푸드 트럭` |
| `font-display` | Black Han Sans | 카드 제목, 이름, 버튼 | `총학생회`, `부스 정보` |
| `font-typewriter` | Courier Prime | 영문 라벨, 메타데이터, 뱃지, 날짜 | `SIDE A · TRACK LIST`, `TRACK`, `STAGE`, `NEW` |
| `font-condensed` | Big Shoulders Display | 큰 숫자, 시간 | `11:00`, 대기번호 `43` |
| `font-body-kr` | Noto Sans KR | 본문, 설명, 입력값 | 공지 내용, 안내 문구 |

자주 쓰는 크기:

- 페이지 제목 `font-sans text-[48px] font-light leading-[56px] tracking-[-1px]`
- 홈 날짜 `font-condensed text-[72px] font-medium`
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

### 컨트롤 (칩 · 검색창 · 아이콘)

작은 컨트롤도 카드처럼 `border-2 border-ink` + 흐림 없는 작은 그림자로 맞춘다 (번지는 그림자·링은 주황 배경에서 지저분해 보이니 쓰지 않는다).

| 요소 | 규칙 |
|---|---|
| 필터 칩 (`CategoryList`) | `h-9 rounded-full border-2 border-ink font-body-kr text-[14px] font-semibold` + 2px 그림자. 선택은 `bg-ink text-paper`, 나머지는 `bg-paper text-ink`. 스크롤 줄은 `-mx-5 px-5`로 화면 끝까지 넓혀 첫 칩이 잘리지 않게 하고, 스크롤 영역이 그림자를 자르지 않게 아래 여백 3px을 둔다 |
| 검색창 (`SearchBar`) | `h-12 rounded-full border-2 border-ink bg-paper` + 3px 그림자, 포커스 시 안쪽 `bg-cream`, 오른쪽 `FiSearch` (입력이 있으면 진한 동그라미 `FiX`) |
| 아이콘 | `react-icons/fi`(Feather)만 쓴다. `✕ ⌕ ▶ − +` 같은 글자 기호는 기기마다 이모지로 바뀌거나 크기가 어긋나므로 쓰지 않는다 (`FiX`, `FiSearch`, `FiPlay fill="currentColor"`, `FiMinus`, `FiPlus`, `FiChevronLeft/Right`) |

## 4. 페이지 뼈대

```tsx
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';

<div className="flex flex-col px-5 pb-16 pt-5 text-ink">
  <RetroPageHeader showMenu />                         {/* ← 메뉴(또는 뒤로가기) + 흰 청운 로고 */}
  <RetroPageTitle title="타임테이블" caption="SIDE A · TRACK LIST" />
  {/* 본문은 pt-6 / mt-6 간격으로 쌓는다 */}
</div>
```

| 컴포넌트 | props | 설명 |
|---|---|---|
| `RetroPageHeader` | `title?`, `showMenu?`, `logoLink?` | 흰 아이콘 헤더. 목록 페이지는 `showMenu`(사이드바 열기), 상세 페이지는 뒤로가기 `‹` + 가운데 `title`. `logoLink={false}`면 로고를 눌러도 홈으로 가지 않는다 (운영진 로그인) |
| `RetroPageTitle` | `title`, `caption?`, `aside?` | 반투명 알약 "활주로: 항대인의 밤" → 얇은 48px 흰 제목 → 타자기 부제. `aside`는 제목 오른쪽 요소(새로고침 버튼 등) |
| `FestivalPill` | — | 알약만 따로 쓸 때 (홈 히어로) |

새 페이지를 추가하면 **`src/layout/Layout.tsx`의 `REDESIGNED_PATHS`에 경로를 꼭 추가**한다. 그래야 예전 Header가 숨고, 노을 배경·별·`RetroFooter`가 적용된다.

### 노을 배경 위 글자

노을 하늘은 Layout 바깥 상자에 **화면 높이에 맞춰 고정**돼 있고(16% maroon · 46% rust · 72% mustard · 100% paper), 가운데 430px 기둥과 페이지는 투명하다. 콘텐츠만 하늘 위로 스크롤되므로 데스크톱에서도 양옆과 이어진다. 별(`<SkyDots night />`)도 고정이다.

- 페이지 루트·섹션에 `bg-*`를 칠하지 않는다. 칠하면 그 부분만 하늘이 끊긴다 (데스크톱에서 띠처럼 보임)
- 카드 밖, 배경 위에 바로 놓이는 글자(안내 문구, 차례 표시 `1 / 4`)는 **제목 바로 아래**에 두고 `text-paper`·`text-paper/80`을 쓴다. 콘텐츠 위쪽 글자는 스크롤해도 화면 위쪽(어두운 쪽)에만 머문다
- 페이지 맨 아래쪽 글자(푸터, 마지막 안내)는 화면 아래쪽(밝은 쪽)에 오므로 `text-ink`
- 글이 길게 이어지는 목록(만든이 명단 등)은 배경 위에 두지 말고 paper 카드로 감싼다
- 티켓 펀치 구멍은 배경을 흉내 낼 수 없으므로 `border border-ink bg-cream` 동그라미로 그린다
- 별(`NIGHT_DOTS`)은 헤더·알약·제목·부제가 놓이는 왼쪽 위(y 80~220, x 300 미만)를 피해 둔다. 글자 사이에 박히면 마침표처럼 보인다
- 한글 줄바꿈은 `body`의 `word-break: keep-all`로 단어 단위다. 계좌번호처럼 끊어야 하는 곳만 `break-all`
- `body`에 `text-wrap: pretty`가 있어 마지막 줄에 낱말 하나만 남지 않는다. `(예: 가수)`처럼 붙어 있어야 읽히는 묶음은 `whitespace-nowrap` 조각으로 감싸고,
  두 문장짜리 안내는 문장 사이에서 줄을 바꾼다 (`\n` + `whitespace-pre-line`)

## 5. 반복 장식 모티프

| 모티프 | 코드 | 쓰인 곳 |
|---|---|---|
| 노을 하늘 + 별 | Layout이 `--gradient-retro-dusk` + `<SkyDots night />`를 화면에 고정해 깐다 | 모든 새 디자인 페이지 (홈 포함) |
| 3색 줄무늬 | `<div className="h-2 w-full bg-retro-stripe" />` (`index.css`의 `@utility`) | 온보딩, 타임테이블 모달 |
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
| `InfoCard` | `components/common` | 위치·시간 등 정보 행. `highlight`, `title`, `titleAction`로 강조 카드 |
| `MenuList` | `components/common` | 메뉴·판매 항목과 가격 |
| `PaymentCard` | `components/common` | 계좌 복사 + QR 확대 |
| `Poster` | `components/common` | 포스터 이미지 + 확대, 로드 실패 시 로고 대체 |
| `CategoryList`, `SearchBar` | `components/common` | 목록 필터. 검색창은 입력이 있으면 지우기(✕) 버튼, 키보드 검색 키로 키보드를 내림 |
| `EmptyState` | `components/common` | 결과 없음·찾을 수 없음. paper 카드 + (선택) 초기화·돌아가기 버튼 |
| `RetroFooter` | `layout` | Layout이 모든 새 디자인 페이지에 자동 렌더. paper 배경 + cream 아이콘 박스 |
| `Sidebar` | `layout` | 기존 디자인 그대로. 로그인하지 않았으면 맨 아래에 카카오 '로그인하기' 버튼 |

### 목록 페이지 UX 규칙

- **필터·검색어는 `useUrlFilters`로 URL에 담는다** (`?category=분식&q=콜팝`). 상세에 갔다가 뒤로 와도 그대로 남는다. 기본값 객체는 모듈 상수로 넘긴다
- **뒤로가기 스크롤 복원은 Layout이 한다.** 그래서 정적 데이터에 가짜 로딩(setTimeout 스켈레톤)을 넣지 않는다. 처음 그릴 때 높이가 짧으면 복원이 안 된다
- 결과가 없으면 `EmptyState`에 초기화 버튼을 단다. 상세 '찾을 수 없음'은 헤더 + `EmptyState`로, 돌아가기는 `navigate(-1)`이 아니라 목록 경로로 보낸다(링크로 바로 들어온 사람이 사이트 밖으로 나가지 않게)
- 서버 이미지가 실패하면 큰 빈 칸을 남기지 않는다 (`Poster`는 낮은 칸으로 줄이고 확대를 막음)
- 모바일 탭 번쩍임은 전역으로 끄고 `active:` 스타일로 눌림을 보여 준다. 키보드 포커스는 전역 `:focus-visible` mustard 테두리
- 움직이는 장식(공지 흐름 등)에는 `motion-reduce:animate-none`

아래에서 올라오는 시트(공지 상세 `NoticeModal`, 공연 상세 `TimetableModal`)는 `rounded-t-[32px] border-2 border-ink` + 슬라이드업 애니메이션 + 아래로 끌어서 닫기 구조다. 새 시트가 필요하면 둘 중 하나를 참고한다.

### 3D 장난감 (게임 탭)

악어 게임·통아저씨는 three.js(React Three Fiber)로 그린다. 공통 부품은 `components/game/toy3d.tsx`.

| 요소 | 규칙 |
|---|---|
| `ToyStage` | `sky-light` 배경 큰 카드 안에 캔버스. 판 조명(`Lightformer`)으로 반사광을 만들어 외부 HDR을 받지 않는다 |
| `Part` | 광택 플라스틱 재질 + `ink` 외곽선(뒷면 껍데기 방식). `color`는 색 토큰 이름만 받는다 |
| `useDragSpin` | 가로로 끌어 돌리기(관성 포함). 탭과 구분하려면 클릭에서 `event.delta > DRAG_THRESHOLD_PX`를 거른다 |
| 지연 로딩 | three.js가 무거우므로 `gameList.ts`에서 `lazy()`로 불러온다 |

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
- [ ] 글꼴 역할을 지켰다 (페이지 제목 sans light / 카드 제목 display / 라벨 typewriter / 숫자 condensed / 본문 body-kr)
- [ ] 카드는 `border-2 border-ink` + 하드 그림자
- [ ] 페이지는 `RetroPageHeader`(목록이면 `showMenu`) + `RetroPageTitle`로 시작
- [ ] 페이지·섹션에 배경색을 칠하지 않았다 (하늘이 끊기지 않음)
- [ ] 노을 배경 위에 바로 놓인 글자는 제목 바로 아래면 `text-paper`, 맨 아래쪽이면 `text-ink`
- [ ] 새 경로를 `REDESIGNED_PATHS`에 추가했다
- [ ] 줄무늬는 `bg-retro-stripe`, 직접 그라디언트를 쓰지 않았다
- [ ] 한/영 전환(`isEng` 또는 `t()`) 확인
- [ ] 402px 폭에서 시안과 비교했다
- [ ] `pnpm build` 통과
