import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { COUNTRY_KR, CountrySelect, type CountrySelectOption } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const countries: CountrySelectOption[] = [
  COUNTRY_KR,
  {
    id: 1,
    alpha2Code: 'US',
    callingCode: '1',
    nameEn: 'United States of America',
    nameEnAlias1: 'United States',
    nameEnAlias2: 'USA',
    nameKo: '미국',
  },
  {
    id: 2,
    alpha2Code: 'JP',
    callingCode: '81',
    nameEn: 'Japan',
    nameKo: '일본',
  },
  {
    id: 3,
    alpha2Code: 'DE',
    callingCode: '49',
    nameEn: 'Germany',
    nameKo: '독일',
  },
];

const loadOptions = async (
  inputValue: string,
  _prevOptions: unknown,
  additional: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
) => {
  const keyword = inputValue.toLowerCase();
  const filtered = countries.filter((country) => {
    const haystack = [
      country.nameKo,
      country.nameEn,
      country.nameEnAlias1,
      country.nameEnAlias2,
      country.alpha2Code,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(keyword);
  });
  const start = (additional.page - 1) * additional.pageSize;
  return {
    options: filtered.slice(start, start + additional.pageSize),
    hasMore: filtered.length > additional.page * additional.pageSize,
    additional: {
      page: additional.page + 1,
      pageSize: additional.pageSize,
    },
  };
};

const meta = {
  title: 'ui/admin/CountrySelect',
  tags: ['ui'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="komc:p-6">
      <CountrySelect
        locale="ko"
        clearIcon={faXmark}
        dropdownIcon={faChevronDown}
        loadOptions={loadOptions}
        placeholder="국가"
      />
    </div>
  ),
};
