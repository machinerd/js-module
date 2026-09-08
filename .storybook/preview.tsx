import '../src/styles/index.css';
import '../src/styles/admin.css';
import '../src/styles/editor.css';
import type { Preview } from '@storybook/react-vite';
import type { ReactElement } from 'react';

const preview: Preview = {
  decorators: [(Story): ReactElement => <Story />],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
