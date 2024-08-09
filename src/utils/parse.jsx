export const parseTags = (items) => {
  return [...new Set(items.filter(o => o.tags).map(o => [...o.tags]).flat(1))];
};

export const parseTokens = (items) => {
  return [...new Set(items.filter(o => o.tokens).map(o => o.tokens.map(t => t.token)).flat(1))];
};

export const parseChains = (items) => {
  return [...new Set(items.filter(o => o.chain).map(o => [...o.chain]).flat(1))];
};
