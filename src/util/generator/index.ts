import { customAlphabet } from 'nanoid';

const generateCandidates = (min: number, max: number) => {
  const candidates = [];
  for (let i = min; i < max; i++) {
    candidates.push(i);
  }
  return candidates;
};

export const randomNum = (min: number, max: number, count = 1) => {
  const rn: number[] = [];
  const candidates = generateCandidates(min, max);
  while (rn.length < count) {
    const mn = Math.ceil(min);
    const mx = Math.floor(candidates.length);
    const r = Math.floor(Math.random() * (mx - mn)) + mn;
    const ra = candidates.splice(r, 1);
    rn.push(ra[0]);
  }
  return [...rn];
};

export const genNanoID = () => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 5);
  return nanoid();
};

export const printNanoID = (cnt: number) => {
  for (let i = 0; i < cnt; i++) {
    console.log(genNanoID());
  }
};

export const generatePage = (
  count: number,
  page: number,
  pagePerView: number,
) => {
  const current = Math.floor((page - 1) / pagePerView);
  const start = current * pagePerView + 1;
  const end = Math.min(start + pagePerView - 1, count);

  return {
    current,
    start,
    end,
  };
};

export const generatePageGroup = (
  count: number,
  page: number,
  pagePerView: number,
) => {
  const { start, end } = generatePage(count, page, pagePerView);
  const prev = start - 1 < 1 ? 1 : start - 1;
  const next = end + 1 > count ? count : end + 1;
  const items = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return {
    prev,
    next,
    isPrev: prev !== 1,
    isNext: end < count,
    items,
  };
};
