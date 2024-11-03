import { PushpinOutlined } from "@ant-design/icons";
import { Card, Flex } from "antd";
import { saveStorage } from '@/utils/storage';
import { Market } from '@/components/Widgets';
import "./style.css";

export default function List({ widgets, favorites, setFavorites }) {
	const setFavorite = (key) => {
		let nfavs = favorites.includes(key) ? favorites.filter(i => i !== key) : [...favorites, key];
		saveStorage("favorite_widgets", nfavs) && setFavorites(nfavs);
	}

	return (
		<Flex gap={16} wrap>
			{
				widgets.map(o => {
					return (
						<Card size={"small"} key={o.key}>
							{o.key === "market" ? <Market autostart={false} /> : o.component}
							<p>{o.name}</p>
							<PushpinOutlined
								className="favorite"
								style={{ color: favorites.includes(o.key) ? "darkorange" : "#343434" }}
								onClick={() => setFavorite(o.key)}
								title={favorites.includes(o.key) ? "Удалить с главной страницы" : "Добавить на главную страницу"}
							/>
						</Card>
					);
				})
			}
		</Flex>
	);
}
