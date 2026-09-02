# @machinerd/js-module

React용 공용 UI·훅·유틸·API 클라이언트 패키지입니다.

**현재 버전:** `0.6` (`package.json`의 `version` 필드와 동일합니다. 배포 전에는 해당 값을 확인하세요.)

**Peer dependency:** `react`, `react-dom` — `^18.3.1` 또는 `^19.0.0`

---

## 설치

```bash
pnpm add @machinerd/js-module
npm install @machinerd/js-module
yarn add @machinerd/js-module
```

컴포넌트를 사용한다면 CSS도 함께 import 해야 합니다.

```js
import '@machinerd/js-module/styles/index.css';
```

에디터(Tiptap)를 쓸 때만 아래를 추가로 넣습니다.

```js
import '@machinerd/js-module/styles/editor.css';
```

---

## API 클라이언트 (`@machinerd/js-module`)

```ts
import ApiClient, { type ApiConfig } from '@machinerd/js-module';

const client = new ApiClient({
  apiEndpoint: 'https://api.example.com',
  cdnEndpoint: 'https://cdn.example.com',
});

await client.login(/* ... */);
client.cdnMedia('path/to/key');
```

---

## Providers

**`Image`·`useSubsetImage` 등 CDN 경로를 다루는 UI·훅**은 내부에서 `useApiClient()`로 **`ApiClient` 인스턴스**에 접근합니다.

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

---

## UI 컴포넌트 (`@machinerd/js-module/ui/common`)

```tsx
import {
  Button,
  ...Other
} from '@machinerd/js-module/ui/common';
import { Carousel } from '@machinerd/js-module/ui/carousel';
...Other

import '@machinerd/js-module/styles/index.css';
```

---

## 로컬 개발·다른 프로젝트에서 검증

### 1. 이 저장소에서 빌드

```bash
pnpm install
pnpm build
```

### 2. tarball로 다른 프로젝트에 넣기 (`pnpm pack`)

```bash
pnpm pack
```

소비하는 프로젝트에서:

```bash
pnpm add /절대/또는/상대/경로/machinerd-js-module-[VERSION].tgz
```

또는 `package.json`에:

```json
{
  "dependencies": {
    "@machinerd/js-module": "file:../js-module/machinerd-js-module-[VERSION].tgz"
  }
}
```
