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
