# @machinerd/js-module

React용 공용 UI·훅·유틸·API 클라이언트 패키지입니다.

---

## 설치

```bash
pnpm add @machinerd/js-module
```

`npm` / `yarn`도 동일합니다. 사용하는 UI에 맞는 peer dependency는 소비하는 앱에 설치해야 합니다. 아래 표를 참고하세요.

---

## CSS

유틸·훅·프로바이더만 쓰면 CSS는 필요 없습니다. `komc:` 유틸이나 `[data-komc]`가 있는 UI를 쓰면 스타일을 import 해야 합니다.

| 파일 | 필요할 때 |
| --- | --- |
| `@machinerd/js-module/styles/index.css` | 공통 UI (버튼, 다이얼로그, 캐러셀 등) |
| `@machinerd/js-module/styles/admin.css` | 어드민 필드·토큰·`form-field` |
| `@machinerd/js-module/styles/editor.css` | 에디터 콘텐츠 스타일 |

```js
import '@machinerd/js-module/styles/index.css';
import '@machinerd/js-module/styles/admin.css';
import '@machinerd/js-module/styles/editor.css';
```

클래스는 `komc:` prefix이고, 공통 UI 리셋·토큰은 `[data-komc]` 안에만 적용됩니다. 호스트 앱의 Tailwind와 겹치지 않습니다. `editor.css`는 TipTap이 붙이는 `.tiptap`에 바로 걸립니다. `data-komc`나 `editor-wrapper`는 필요 없습니다. 필드 크롬까지 쓰려면 `admin.css`를 같이 넣습니다. 노드 호버·선택 링은 `.komc-node-frame`에, 드래그는 `data-drag-handle`에 걸립니다.

---

## 에디터

`Loader`와 노드·익스텐션은 엔트리가 나뉘어 있습니다. 서버에서 스키마만 쓸 때는 노드/익스텐션을 직접 import 하면 됩니다.

```js
import { Loader } from '@machinerd/js-module/editor';
import { CustomHeading } from '@machinerd/js-module/editor/nodes/custom-heading';
import { Align } from '@machinerd/js-module/editor/extensions/align';
```

이미지 노드에 호스트 메뉴를 붙이려면 `plugins`에 컴포넌트를 넣습니다. `NodeSize` / `NodeResizer`는 기본 플러그인이라 같이 넣지 않아도 됩니다. 크기 입력의 최소·최댓값은 `size`로 넘기고, `plugins`에 `nodeSize()`를 또 넣으면 오버레이가 두 번 뜹니다. 메뉴는 NodeView 안에서 렌더되고, `useNodeView()`로 `updateAttributes` / `node` / `deleteNode`를 씁니다.

```js
import { MenuWrapper, useNodeView } from '@machinerd/js-module/editor/nodes/menu-wrapper';
import type { SubsetImageAttrs } from '@machinerd/js-module/editor/nodes/subset-image';

function ImageMenu() {
  const { node, updateAttributes, deleteNode } =
    useNodeView<SubsetImageAttrs>();

  return (
    <MenuWrapper>
      <MenuWrapper.Item
        onClick={() => updateAttributes({ alt: node.attrs.alt })}
      />
      <MenuWrapper.Item onClick={deleteNode} />
    </MenuWrapper>
  );
}

new Loader().mediaset({
  subsetImage: {
    size: { maxWidth: 829 },
    plugins: [ImageMenu],
  },
  basicImage: { plugins: [ImageMenu] },
});
```

| 엔트리 | 내용 |
| --- | --- |
| `@machinerd/js-module/editor` | `Loader` |
| `@machinerd/js-module/editor/nodes/basic-image` | `BasicImage` |
| `@machinerd/js-module/editor/nodes/subset-image` | `SubsetImage`, `SubsetImageAttrs` |
| `@machinerd/js-module/editor/nodes/custom-heading` | `CustomHeading` |
| `@machinerd/js-module/editor/nodes/table` | `Table`, `TableRow`, `TableCell`, `TableHeader` |
| `@machinerd/js-module/editor/nodes/tabs` | `Tabs`, `TabTitle`, `TabContent` |
| `@machinerd/js-module/editor/nodes/menu-wrapper` | `MenuWrapper`, `useNodeView` |
| `@machinerd/js-module/editor/nodes/node-view-context` | `useNodeView`, `PluginNodeView`, `withNodeViewChrome` |
| `@machinerd/js-module/editor/nodes/node-resize` | `NodeResizer`, `NodeResizerPlugin` |
| `@machinerd/js-module/editor/nodes/node-size` | `NodeSize`, `NodeSizePlugin`, `nodeSize` |
| `@machinerd/js-module/editor/extensions/align` | `Align` |
| `@machinerd/js-module/editor/extensions/table-resize` | `TableResize` |
| `@machinerd/js-module/editor/extensions/table-controls` | `TableControls` |

---

## Peer dependency

`react` / `react-dom`만 필수입니다. 나머지는 해당 엔트리를 쓸 때만 설치하면 됩니다.

| 패키지 | 버전 | 필수 | 사용처 |
| --- | --- | --- | --- |
| `react` | `^18.3.1` 또는 `^19.0.0` | 예 | 전체 |
| `react-dom` | `^18.3.1` 또는 `^19.0.0` | 예 | 전체 |
| `@fortawesome/fontawesome-svg-core` | `^6.0.0` 또는 `^7.0.0` | 아니오 | 어드민 필드 아이콘 타입 |
| `@fortawesome/react-fontawesome` | `^3.0.0` | 아니오 | 어드민 필드 아이콘 렌더 |
| `@floating-ui/react` | `^0.27.0` | 아니오 | `ui/dropdown` |
| `@dnd-kit/core` | `^6.0.0` | 아니오 | `ui/dnd`, video/source/file/series/sns/image-list 필드 |
| `@dnd-kit/modifiers` | `^9.0.0` | 아니오 | `ui/dnd` |
| `@dnd-kit/sortable` | `^10.0.0` | 아니오 | `ui/dnd`, video/source/file/series/sns/image-list 필드 |
| `@dnd-kit/utilities` | `^3.0.0` | 아니오 | `ui/dnd`, video/source/file/series/sns/image-list 필드 |
| `embla-carousel` | `^8.0.0` | 아니오 | `ui/carousel` |
| `embla-carousel-react` | `^8.0.0` | 아니오 | `ui/carousel` |
| `motion` | `^13.0.0` | 아니오 | `ui/motion-dialog`, `ui/radius-handler` |
| `notistack` | `^3.0.0` | 아니오 | `hooks/use-snackbar`, `providers/noti-stack` |
| `react-dropzone` | `>=14.0.0 <21.0.0` | 아니오 | `ui/admin/dropzone-field` |
| `react-hook-form` | `^7.0.0` | 아니오 | `ui/admin/with-extra-field` |
| `react-select` | `^5.0.0` | 아니오 | `ui/admin/select-field`, `ui/admin/source-field`, `ui/admin/sns-field`, `ui/admin/async-select-field`, `ui/admin/country-select` |
| `react-select-async-paginate` | `^0.7.0` | 아니오 | `ui/admin/async-select-field`, `ui/admin/country-select` |
| `@tailwindcss/typography` | `^0.5.0` | 아니오 | `styles/editor.css` |
| `@tiptap/core` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-color` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-details` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-document` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-heading` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-image` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-list` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-paragraph` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-table` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-text` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-text-style` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extension-youtube` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/extensions` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/pm` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/react` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/starter-kit` | `^3.0.0` | 아니오 | 에디터 |
| `@tiptap/suggestion` | `^3.0.0` | 아니오 | 에디터 |

---

## 로컬 개발

- 패키지 매니저는 `pnpm`입니다 (`packageManager`: `pnpm@10.25.0`).
- 소비하는 앱은 `dist`를 봅니다. 코드를 바꾼 뒤에는 이 저장소에서 다시 빌드해야 합니다.
- UI 루트에는 `data-komc`가 있어야 리셋·토큰이 적용됩니다. 라이브러리 컴포넌트가 대부분 붙여 둡니다.
- 다른 프로젝트에서 확인하려면 빌드 후 tarball을 넣습니다.

```bash
pnpm pack
pnpm add /절대/또는/상대/경로/machinerd-js-module-[VERSION].tgz
```

`package.json`에는 이렇게 적어도 됩니다.

```json
{
  "dependencies": {
    "@machinerd/js-module": "file:../js-module/machinerd-js-module-[VERSION].tgz"
  }
}
```

---

## 빌드

```bash
pnpm install
pnpm build
```

`pnpm build`는 JS(`tsdown`)와 CSS(`index` / `admin` / `editor`)를 `dist`에 만듭니다. 배포 전에만 쓰려면 `pnpm build:pack`으로 빌드와 `pack`을 한 번에 할 수 있습니다.

---

## 테스트

단위 테스트 스크립트는 아직 없습니다. 지금은 아래를 쓰면 됩니다.

```bash
pnpm lint
pnpm build:tsc
pnpm storybook
```

- `lint` — ESLint
- `build:tsc` — 타입 체크
- `storybook` — `http://localhost:6006`에서 UI 확인
