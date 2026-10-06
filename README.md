# 다중 언어(i18n) 사용 가이드

이 프로젝트는 `i18next`, `react-i18next`, `i18next-browser-languagedetector`로 다국어를 구성합니다.

## 현재 i18n 설정 요약

- 기본 언어: `ko`
- 지원 언어: `ko`, `en`
- 기본 네임스페이스: `common`
- 언어 감지 순서: `localStorage -> navigator -> htmlTag`
- 감지 언어 캐시: `localStorage`

초기화 파일은 `src/i18n/index.ts`이고, 앱 시작 시 `src/main.tsx`에서 `import './i18n'`으로 로드됩니다.

## 번역 파일 구조

```txt
src/
  i18n/
    index.ts
    locales/
      ko/
        common.json
      en/
        common.json
```

## 컴포넌트에서 번역 사용

```tsx
import { useTranslation } from 'react-i18next';

function Example() {
  const { t } = useTranslation();

  return <h1>{t('hello')}</h1>;
}
```

현재 설정에서는 `defaultNS: 'common'`이라 `t('hello')`처럼 바로 사용할 수 있습니다.

## 언어 변경 방법

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div>
      <button type="button" onClick={() => i18n.changeLanguage('ko')}>
        한국어
      </button>
      <button type="button" onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
      <p>{t('changeLanguage')}</p>
    </div>
  );
}
```

`changeLanguage` 호출 시 브라우저 `localStorage`에 언어가 저장되어 재방문 시 유지됩니다.

## 번역 키 추가 방법

1. `src/i18n/locales/ko/common.json`에 키 추가
2. 같은 키를 `src/i18n/locales/en/common.json`에도 추가
3. 컴포넌트에서 `t('키이름')`으로 사용

예시:

```json
{
  "homeTitle": "홈",
  "welcomeUser": "{{name}}님, 환영합니다."
}
```

```tsx
<p>{t('welcomeUser', { name: '청운' })}</p>
```

## 새 언어 추가 (예: 일본어)

1. `src/i18n/locales/ja/common.json` 생성
2. `src/i18n/index.ts`의 `resources`에 `ja` 등록
3. `supportedLngs`에 `ja` 추가
4. 언어 전환 UI에 `i18n.changeLanguage('ja')` 버튼 추가

## 운영 시 권장 규칙

- 키 네이밍은 기능 단위로 관리 (`notice.title`, `notice.empty` 같은 패턴 권장)
- 한글/영문 JSON의 키 구조를 항상 동일하게 유지
- 문장은 하드코딩하지 말고 반드시 `t()`로 출력
- JSON 문법 오류(쉼표, 따옴표) 발생 시 앱이 깨질 수 있으니 저장 전 확인
