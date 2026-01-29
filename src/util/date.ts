import dayjs from 'dayjs';
import 'dayjs/locale/ko.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

export const displayDatetime = (
  date: string,
  format = 'YYYY-MM-DD',
  locale = 'en',
) => {
  const d = dayjs(date).locale(locale);
  const now = dayjs();
  const diff = now.diff(d, 'hour');
  if (diff < 12) {
    return d.fromNow();
  }
  return d.format(format);
};
