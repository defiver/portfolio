import { atom, selector } from "recoil";

export const poolsState = atom({
  key: "LlamaPools",
  default: [],
});

export const filterState = atom({
  key: "LlamaFilter",
  default: {
    query: "",
    chain: null,
    project: null,
    attribute: [],
    sort: "apy",
  },
});

export const filteredPoolsState = selector({
  key: "FilteredLlamaPools",
  get: ({ get }) => {
    const filter = get(filterState);
    let pools = get(poolsState);

    if (filter.query) {
      let clearquery = filter.query.toLowerCase().trim().replace(/ +/, ' ');
      pools = pools.filter(o => o.name.toLowerCase().includes(clearquery));
    }

    if (filter.chain) {
      pools = pools.filter(o => o.chain === filter.chain);
    }

    if (filter.project) {
      pools = pools.filter(o => o.project === filter.project);
    }

    if (filter.attribute.length) {
      if (filter.attribute.includes("noil")) {
        pools = pools.filter((o) => o.il === "no");
      }
      if (filter.attribute.includes("stable")) {
        pools = pools.filter((o) => o.stable);
      }
      if (filter.attribute.includes("multi")) {
        pools = pools.filter((o) => o.exposure === "multi");
      }
      if (filter.attribute.includes("single")) {
        pools = pools.filter((o) => o.exposure === "single");
      }
      if (filter.attribute.includes("nooutlier")) {
        pools = pools.filter((o) => !o.outlier);
      }
    }

    return [...pools].sort((a, b) => b[filter.sort] - a[filter.sort]);
  },
});

export const allChainsState = selector({
  key: "LlamaChains",
  get: ({ get }) => {
    const pools = get(poolsState);
    return [...new Set(pools.map(o => o.chain))].sort();
  },
});

export const allProjectsState = selector({
  key: "LlamaProjects",
  get: ({ get }) => {
    const pools = get(poolsState);
    return [...new Set(pools.map(o => o.project))].sort();
  },
});