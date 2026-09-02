import { defineConfig } from 'tsdown';
import pkg from './package.json' with { type: 'json' };

const external = Object.keys(pkg.peerDependencies || {});

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/util/browser.ts',
    './src/util/common.ts',
    './src/util/date.ts',
    './src/util/fetcher.ts',
    './src/util/file.ts',
    './src/util/format.ts',
    './src/util/generator.ts',
    './src/util/phone.ts',
    './src/ui/index.ts',
    './src/ui/carousel/index.ts',
    './src/ui/dialog/index.ts',
    './src/ui/motion-dialog/index.ts',
    './src/ui/dnd/index.ts',
    './src/ui/image/index.ts',
    './src/ui/sheet/index.ts',
    './src/ui/switch/index.ts',
    './src/ui/tooltip/index.ts',
    './src/hooks/common/index.ts',
    './src/hooks/use-snackbar.ts',
    './src/providers/api-client/index.ts',
    './src/providers/noti-stack/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  external: ['react/jsx-runtime', ...external],
});
