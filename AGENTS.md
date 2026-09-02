# AGENTS.md

이 저장소에서 작업할 때 아래 수칙을 따른다. 사용자가 따로 요청하지 않아도 적용한다.

## 파일·엔트리

- 파일·폴더 이름은 kebab-case로 작성한다. (`text-field`, `use-window-size`)
- 새로 내보내는 모듈은 `폴더 / 구현 파일 / index.ts` 구조를 따른다. `package.json`·`tsdown`은 `* /index.ts` 와일드카드이므로, 이 형태면 별도 엔트리 등록이 필요 없다.
- Next.js App Router를 고려해, 브라우저 API·훅·이벤트가 있는 모듈에는 `'use client'`를 넣는다. 서버에서 쓸 수 있는 모듈에는 넣지 않는다.

## 스타일

- Tailwind 유틸리티에는 항상 `komc:` prefix를 붙인다. (`komc:flex`, `komc:text-lg`)
- 이 패키지 CSS가 클래스명으로 거는 표시자에는 `komc-`를 붙인다. (`komc-active`, `komc-error`, `komc-no-scrollbar`)

## 문서

- 컴포넌트 엔트리 추가·삭제, peer dependency 추가·변경·삭제가 있으면 `README.md`의 해당 표·설명을 같이 수정한다.

## 검증

- 작업이 끝났다고 해서 `build`, `lint`, `tsc`, Storybook, 브라우저 테스트를 임의로 돌리지 않는다. 사용자가 요청한 경우에만 수행한다.

## 불확실할 때

- 요구사항·기존 관례·API를 확신할 수 없으면 추측으로 진행하지 않는다. 작업을 멈추고 선택지를 제안한 뒤 확인을 받는다.
