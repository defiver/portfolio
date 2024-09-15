import { XOutlined, DiscordOutlined, LinkOutlined, StarOutlined, InfoCircleOutlined, SendOutlined } from "@ant-design/icons";
import { saveStorage } from '@/utils/storage';
import { Card, Avatar, Popover, Badge, Space } from "antd";

export default function ToolCard({ item, favorites, setFavorites }) {
	// записываем фаворитов в массив в localStorage
	const setFavorite = () => {
		let nfavs = favorites.includes(item.name)
			? favorites.filter(i => i !== item.name)
			: [...favorites, item.name];
		saveStorage("favorite_tools", nfavs) && setFavorites(nfavs);
	}

	// проставляем для ссылок соответсвующие иконки
	const actions = item.links.map(url => {
		if (url.toLowerCase().includes("twitter.") || url.toLowerCase().includes("/x.com")) {
			return <a href={url} key={"twitter"}><XOutlined /></a>
		}
		if (url.toLowerCase().includes("discord.")) {
			return <a href={url} key="discord"><DiscordOutlined /></a>
		}
		if (url.toLowerCase().includes("t.me")) {
			return <a href={url} key="discord"><SendOutlined /></a>
		}
		return <a href={url} key="link"><LinkOutlined /></a>;
	});

	return (
		<Badge
			key={item.name}
			count={
				<Space>
					<Popover overlayStyle={{ width: 250 }} content={item.description}>
						<InfoCircleOutlined style={{ color: "#343434" }} />
					</Popover>
					<StarOutlined
						style={{ color: favorites.includes(item.name) ? "darkorange" : "#343434", cursor: "pointer" }}
						onClick={setFavorite}
					/>
				</Space>
			}
			offset={[-24, 12]}
		>
			<Card actions={actions} className="tool-card">
				<Card.Meta
					title={item.name}
					avatar={<Avatar src={item.icon} alt={item.name} />}
				/>
			</Card>
		</Badge>
	)
}
