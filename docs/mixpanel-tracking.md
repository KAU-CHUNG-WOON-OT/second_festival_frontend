# Mixpanel 이벤트 트래킹

프로젝트 토큰: `e17832f64211ab234720d3816a8fec40`

## 초기 설정

- 라이브러리: `mixpanel-browser`
- 초기화 위치: `src/lib/mixpanel.ts`
- 데이터 저장 방식: `localStorage`
- 페이지 조회 추적: 수동 방식 (`usePageTracking` 훅 사용)

## 유틸리티 함수

`src/lib/mixpanel.ts`에서 아래 함수들을 export합니다.

| 함수 | 설명 |
|------|------|
| `track(event, props?)` | 이벤트 발송 |
| `identify(studentId)` | 이벤트를 특정 유저와 연결 |
| `setPeople(props)` | 유저 프로필 속성 설정 |
| `reset()` | 로그아웃 시 식별 정보 초기화 |

## 유저 식별 전략

앱이 열리는 순간부터 Mixpanel이 자동 생성한 `distinct_id`로 익명 이벤트가 수집됩니다. 유저 식별은 두 시점에서 이루어집니다.

1. **최초 정보 등록 시** — `InfoInputPage.tsx`에서 프로필 제출 성공 후 `identify(studentId)` + `setPeople(...)` 호출
2. **재방문 시** — `AuthBootGate.tsx`에서 앱 로드 시 localStorage에 유저 정보가 있으면 `identify(studentId)` + `setPeople(...)` 호출

Mixpanel의 Simplified ID Merge 기능이 로그인 이전의 익명 이벤트를 식별된 프로필에 자동으로 병합합니다.

**설정되는 People 속성:**

| 속성 | 값 |
|------|----|
| `$name` | 실명 |
| `department` | 학과 |
| `student_type` | `UNDERGRADUATE` / `ON_LEAVE` / `GRADUATE` |

## 트래킹 이벤트 목록

### `page_viewed`

모든 라우트 이동 시 `usePageTracking` 훅을 통해 자동 발송됩니다 (`Layout.tsx` 내부에서 호출).

| 속성 | 타입 | 설명 |
|------|------|------|
| `path` | string | 현재 경로 (예: `/home`) |
| `page_name` | string | 페이지 이름 (예: `Home`) |

**경로 → 페이지 이름 매핑:**

| 경로 | 페이지 이름 |
|------|------------|
| `/` | Entry |
| `/home` | Home |
| `/onboarding` | Onboarding |
| `/notice` | Notice |
| `/timetable` | Timetable |
| `/performance` | Performance |
| `/foodtruck` | FoodTruck List |
| `/foodtruck/:id` | FoodTruck Detail |
| `/yard` | Yard List |
| `/yard/:id` | Booth Detail |
| `/pub` | Pub List |
| `/pub/:id` | Pub Detail |
| `/makers` | Makers |
| `/game` | Game |
| `/game/:gameId` | Game Play |
| `/info` | Info Input |
| `/info-guide` | Info Guide |

---

### `language_changed`

KOR / ENG 언어 전환 시 발송됩니다.

**파일:** `src/contexts/LanguageContext.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `from` | string | 전환 전 언어 (`KOR` / `ENG`) |
| `to` | string | 전환 후 언어 (`KOR` / `ENG`) |

---

### `login_completed`

OAuth 리다이렉트가 완료될 때 (카카오 로그인 완료 시) 발송됩니다.

**파일:** `src/pages/OAuthRedirectPage.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `destination` | string | `/info` (신규 유저) 또는 `/home` (기존 유저) |

---

### `onboarding_kakao_login_clicked`

온보딩 화면에서 카카오 로그인 버튼을 탭했을 때 발송됩니다.

**파일:** `src/pages/OnboardingPage.tsx`

추가 속성 없음.

---

### `onboarding_guest_login_clicked`

온보딩 화면에서 비회원 접속을 최종 확정했을 때 발송됩니다.

**파일:** `src/pages/OnboardingPage.tsx`

추가 속성 없음.

---

### `user_info_submitted`

유저가 최초로 프로필(실명, 학번, 학과, 이메일, 학적)을 성공적으로 제출했을 때 발송됩니다.

**파일:** `src/pages/InfoInputPage.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `student_type` | string | `UNDERGRADUATE` / `ON_LEAVE` / `GRADUATE` |

참고: 이 시점에 `identify()` 및 `setPeople()`도 함께 호출됩니다.

---

### `notice_modal_opened`

공지사항 모달이 열렸을 때 발송됩니다.

**파일:** `src/components/notice/NoticeModal.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `notice_id` | number | 공지 ID |
| `notice_title` | string | 공지 제목 |

---

### `timetable_performance_clicked`

타임테이블에서 공연 항목을 클릭했을 때 발송됩니다.

**파일:** `src/pages/TimetablePage.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `event_id` | number | 공연 ID |
| `event_title` | string | 공연 제목 |
| `event_type` | string | 공연 유형 (`PERFORMANCE` / `EVENT` / `CEREMONY` / `BREAKTIME`) |
| `event_date` | string | 날짜 (예: `5월 15일`) |

---

### `item_liked`

주점 또는 푸드트럭 메뉴 아이템에 좋아요를 성공적으로 눌렀을 때 발송됩니다.

**파일:** `src/hooks/useBarLike.ts`, `src/hooks/useMenuLike.ts`

| 속성 | 타입 | 설명 |
|------|------|------|
| `item_type` | string | `bar` (주점) 또는 `menu` (메뉴) |
| `item_id` | number | 좋아요한 아이템 ID |

---

### `item_unliked`

주점 또는 푸드트럭 메뉴 아이템의 좋아요를 성공적으로 취소했을 때 발송됩니다.

**파일:** `src/hooks/useBarLike.ts`, `src/hooks/useMenuLike.ts`

| 속성 | 타입 | 설명 |
|------|------|------|
| `item_type` | string | `bar` (주점) 또는 `menu` (메뉴) |
| `item_id` | number | 좋아요 취소한 아이템 ID |

---

### `menu_like_kakao_login_clicked`

비로그인 상태에서 메뉴 좋아요 클릭 시 카카오 로그인 유도 버튼을 눌렀을 때 발송됩니다.

**파일:** `src/components/common/MenuList.tsx`

추가 속성 없음.

---

### `foodtruck_detail_viewed`

푸드트럭 상세 페이지에 진입했을 때 발송됩니다.

**파일:** `src/pages/FoodTruckDetailPage.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `foodtruck_id` | number | 푸드트럭 ID |

---

### `booth_detail_viewed`

야드 부스 상세 페이지에 진입했을 때 발송됩니다.

**파일:** `src/pages/BoothDetailPage.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `booth_id` | number | 부스 ID |

---

### `pub_detail_viewed`

주점 상세 페이지에 진입했을 때 발송됩니다.

**파일:** `src/pages/PubDetailPage.tsx`

| 속성 | 타입 | 설명 |
|------|------|------|
| `pub_id` | number | 주점 ID |

---

## 새 이벤트 추가 방법

1. `@/lib/mixpanel`에서 `track` 함수를 import
2. 적절한 시점에 `track('이벤트_이름', { 속성: 값 })` 호출
3. 이벤트명은 `object_verb` 형식의 snake_case 사용 (예: `ticket_reserved`, `TicketReserved` 금지)
4. 유저 식별자로 이메일 사용 금지 (학번 사용)
5. 이 문서에 새 이벤트 내용 추가
