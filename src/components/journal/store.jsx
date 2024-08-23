import { atom, selector } from "recoil";
import { parseTags, parseTokens, parseChains } from "@/utils/parse";

export const journalState = atom({
  key: "Journal",
  default: [],
});

export const idState = atom({
  key: "id",
  default: null,
});

export const filterState = atom({
  key: "Filter",
  default: {
    tag: null,
    token: null,
    chain: null,
    status: true,
  },
});

export const filteredJournalState = selector({
  key: "FilteredJournal",
  get: ({ get }) => {
    const filter = get(filterState);
    let journal = get(journalState);

    if (filter.tag) {
      journal = journal.filter((o) => o.tags && o.tags.includes(filter.tag));
    }

    if (filter.token) {
      journal = journal.filter(
        (o) => o.tokens && o.tokens.filter(t => t.token === filter.token).length
      );
    }

    if (filter.chain) {
      journal = journal.filter((o) => o.chain && o.chain.includes(filter.chain));
    }

    return journal.filter((o) => filter.status ^ (o.status !== "active"));
  },
});

export const tagsState = selector({
  key: "Tags",
  get: ({ get }) => {
    const journal = get(filteredJournalState);
    return parseTags(journal);
  },
});

export const tokensState = selector({
  key: "Tokens",
  get: ({ get }) => {
    let journal = get(filteredJournalState);
    return parseTokens(journal);
  },
});

export const chainsState = selector({
  key: "Chains",
  get: ({ get }) => {
    let journal = get(filteredJournalState);
    return parseChains(journal);
  },
});

export const allTagsState = selector({
  key: "AllTags",
  get: ({ get }) => {
    const journal = get(journalState);
    return parseTags(journal);
  },
});

export const allChainsState = selector({
  key: "AllChains",
  get: ({ get }) => {
    const journal = get(journalState);
    return parseChains(journal);
  },
});