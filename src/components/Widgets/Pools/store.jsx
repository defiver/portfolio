import { atom, selector } from "recoil";

export const poolsListState = atom({
  key: "PoolsList",
  default: [],
});

export const formAddressState = atom({
  key: "FormAddress",
  default: null,
});

export const loadingPoolState = atom({
  key: "LoadingPool",
  default: undefined,
});

export const sortPoolsListState = selector({
  key: "SortPoolsList",
  get: ({ get }) => {
    const pools = get(poolsListState);
    return [...pools].sort((a, b) => a?.name && b?.name && a.name.localeCompare(b.name));
  },
});