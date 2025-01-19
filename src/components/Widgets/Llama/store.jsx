import { atom, selector } from "recoil";

export const poolsState = atom({
  key: "LlamaPools",
  default: [],
});

export const filterState = atom({
  key: "LlamaFilter",
  default: {
    query: "",
    chains: [],
    negative_chains: [],
    projects: [],
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

      if (clearquery.at(0) === "^") {
        pools = pools.filter(o => `^${o.name}`.toLowerCase().includes(clearquery));
      } else {
        pools = pools.filter(o => o.name.toLowerCase().includes(clearquery));
      }
    }

    if (filter.chains.length) {
      pools = pools.filter(o => filter.chains.includes(o.chain));
    }

    if (filter.negative_chains.length) {
      pools = pools.filter(o => !filter.negative_chains.includes(o.chain));
    }

    if (filter.projects.length) {
      pools = pools.filter(o => filter.projects.includes(o.project));
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