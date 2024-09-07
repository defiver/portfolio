import { atom } from "recoil";

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