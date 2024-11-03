import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { poolsState } from "./store";
import PoolsList from './PoolsList';

export default function Pools({ db }) {
	const pools = useLiveQuery(() => db.llama.toArray(), [], []);
	const [, setPools] = useRecoilState(poolsState);

	useEffect(() => {
		setPools(pools);
	}, [pools]); // eslint-disable-line react-hooks/exhaustive-deps

	return <PoolsList db={db} />
}