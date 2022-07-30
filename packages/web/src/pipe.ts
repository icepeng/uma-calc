export function renderRarity(rarity: number) {
  if (rarity === 1) {
    return 'R';
  }
  if (rarity === 2) {
    return 'SR';
  }
  if (rarity === 3) {
    return 'SSR';
  }
  return '?';
}

export function renderType(type: string) {
  if (type === 'speed') {
    return '스피드';
  }
  if (type === 'stamina') {
    return '스태미너';
  }
  if (type === 'power') {
    return '파워';
  }
  if (type === 'guts') {
    return '근성';
  }
  if (type === 'intelligence') {
    return '지능';
  }
  if (type === 'friend') {
    return '친구';
  }
  return '?';
}

export function handleNumber(value: number | string, fallbackValue = 0) {
  const num = +value;
  if (isNaN(num)) {
    return fallbackValue;
  }
  return num;
}
