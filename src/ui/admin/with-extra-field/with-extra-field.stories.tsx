import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '../text-field';
import { withExtraField } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface FormValues {
  extras: string[];
}

const ExtraTextField = withExtraField<
  FormValues,
  ComponentProps<typeof TextField>
>(TextField);

const ExtraFieldDemo = () => {
  const { control } = useForm<FormValues>({
    defaultValues: { extras: [] },
  });

  return (
    <div className="komc:max-w-md komc:p-6">
      <ExtraTextField
        control={control}
        extraFieldName="extras"
        add={<FontAwesomeIcon icon={faPlus} />}
        remove={<FontAwesomeIcon icon={faXmark} />}
        label={{ text: '항목' }}
        placeholder="값을 입력하세요"
      />
    </div>
  );
};

const meta = {
  title: 'ui/admin/withExtraField',
  tags: ['ui'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <ExtraFieldDemo />,
};
