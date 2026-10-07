// min, max 모두 포함하는 정수
export const randomInt = (min: number, max: number, random: () => number = Math.random) =>
  min + Math.floor(random() * (max - min + 1));

export const pickRandom = <T>(items: T[], random: () => number = Math.random): T =>
  items[Math.floor(random() * items.length)];
