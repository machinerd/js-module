# @machinerd/js-module

React용 공용 UI·훅·유틸·API 클라이언트 패키지입니다.

**현재 버전:** `0.5` (`package.json`의 `version` 필드와 동일합니다. 배포 전에는 해당 값을 확인하세요.)

**Peer dependency:** `react`, `react-dom` — `^18.3.1` 또는 `^19.0.0`

---

## 설치

```bash
pnpm add @machinerd/js-module
# 또는
npm install @machinerd/js-module
yarn add @machinerd/js-module
```

스타일을 쓰는 UI를 사용한다면 CSS도 함께 import 합니다.

```js
import '@machinerd/js-module/styles/index.css';
```

---

## API 클라이언트 (`@machinerd/js-module`)

기본 export는 `ApiClient` 클래스입니다. 인스턴스를 만들어 props나 훅 인자로 넘깁니다.

```ts
import ApiClient, { type ApiConfig } from '@machinerd/js-module';

const client = new ApiClient({
  apiEndpoint: 'https://api.example.com',
  cdnEndpoint: 'https://cdn.example.com',
});

await client.login(/* ... */);
client.cdnMedia('path/to/key');
```

로그인·CDN URL 빌드 등에는 위처럼 직접 인스턴스를 만들어 쓸 수 있습니다.

---

## Providers

Export 경로: `@machinerd/js-module/providers`

**`Image`·`useSubsetImage` 등 CDN 경로를 다루는 UI·훅**은 내부에서 `useApiClient()`로 **`ApiClient` 인스턴스**에 접근합니다. 사용하는 쪽에서 매번 `ApiClient`를 만들어 props로 넘기지 않도록, **앱(또는 라우트 트리) 최상단**을 `ApiClientProvider`로 감싸고 `config`만 넘기면 됩니다.

```tsx
import { ApiClientProvider } from '@machinerd/js-module/providers';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ApiClientProvider
      config={{
        apiEndpoint: 'https://api.example.com',
        cdnEndpoint: 'https://cdn.example.com',
      }}
    >
      {children}
    </ApiClientProvider>
  );
}
```

- Next.js App Router라면 `app/layout.tsx` 등 **루트 레이아웃**에 두는 것을 권장합니다.
- Provider 밖에서 `Image` / `useSubsetImage`를 쓰면 런타임에 `ApiClient not found` 오류가 납니다.

`useApiClient`는 같은 패키지의 `./providers`에서 export 됩니다.

---

## UI 컴포넌트 (`@machinerd/js-module/ui`)

서버·클라이언트 구분 없이 쓸 수 있는 컴포넌트입니다.

```tsx
import {
  BottomAppBar,
  Button,
  ConditionalWrapper,
  Input,
  Skeleton,
} from '@machinerd/js-module/ui';
import '@machinerd/js-module/styles/index.css';
```

각 컴포넌트의 props·변형은 Storybook(`pnpm storybook`) 또는 소스의 타입 정의를 참고하면 됩니다.

---

## 클라이언트 전용 UI (`@machinerd/js-module/ui-client`)

브라우저 API·상태에 의존하는 컴포넌트입니다. **번들/페이지의 클라이언트 경계 안**에서만 사용하세요.

```tsx
import { Carousel, CarouselItem, Image, Tooltip /* … */ } from '@machinerd/js-module/ui-client';
import '@machinerd/js-module/styles/index.css';
```

**`Image`를 쓰려면** 위 [Providers](#providers)의 **`ApiClientProvider`를 최상위에 두는 것**이 필요합니다. CDN·API 엔드포인트는 `config`로 한 번만 넘기면 되며, `Image`에 `ApiClient`를 props로 넘길 필요는 없습니다. props·Storybook 문서는 타입 정의와 Storybook을 참고하세요.

> **참고:** export 경로는 `ui/client`가 아니라 **`ui-client`** 입니다 (`package.json`의 `exports`와 일치).

---

## 훅 (`@machinerd/js-module/hooks`)

```ts
import { useOutsideClick, useWindowSize } from '@machinerd/js-module/hooks';
```

`useOutsideClick`은 타입 `UseOutsideClickProps`도 함께 export 합니다.

`useSubsetImage`는 **`ApiClientProvider` 안**에서만 사용할 수 있습니다 ([Providers](#providers)).

---

## 유틸 (`@machinerd/js-module/util`)

`browser`, `common`, `date`, `file`, `format`, `generator` 등 모듈에서 필요한 심볼을 re-export 합니다.

```ts
import { formatI18nNumber } from '@machinerd/js-module/util';
import { isExternalSrc } from '@machinerd/js-module/util';
```

전체 목록은 `src/util/index.ts`를 보거나 IDE 자동완성으로 확인하는 것이 좋습니다.

---

## 로컬 개발·다른 프로젝트에서 검증

### 1. 이 저장소에서 빌드

```bash
pnpm install
pnpm build
```

`prepublishOnly`에 `pnpm build`가 걸려 있어 `pnpm publish` 전에도 빌드가 돌지만, pack 테스트 전에 한 번 빌드하는 것을 권장합니다.

### 2. tarball로 다른 프로젝트에 넣기 (`pnpm pack`)

```bash
pnpm pack
```

현재 버전 기준으로 예: `machinerd-js-module-0.5.0.tgz` 형태의 파일이 상위 디렉터리(또는 현재 디렉터리)에 생성됩니다. 정확한 파일명은 명령 출력을 따르세요.

소비하는 프로젝트에서:

```bash
pnpm add /절대/또는/상대/경로/machinerd-js-module-0.4.0.tgz
```

또는 `package.json`에:

```json
{
  "dependencies": {
    "@machinerd/js-module": "file:../js-module/machinerd-js-module-0.4.0.tgz"
  }
}
```

### 3. `pnpm link` (글로벌 링크)

```bash
# js-module 쪽
pnpm link --global

# 소비 프로젝트 쪽
pnpm link --global @machinerd/js-module
```

워크스페이스 모노레포라면 `pnpm-workspace.yaml`에 패키지 경로를 넣고 `workspace:*` 의존성으로 연결하는 방식이 더 안정적입니다.

### 4. Storybook으로 UI만 확인

```bash
pnpm storybook
```

---

## 스크립트 요약

| 명령 | 설명 |
|------|------|
| `pnpm build` | 라이브러리 + CSS 빌드 |
| `pnpm storybook` | 컴포넌트 문서·예제 (로컬) |
| `pnpm build-storybook` | 정적 Storybook 빌드 |
| `pnpm pack` | npm 패키지 tarball 생성 (로컬 설치 테스트용) |

---
