import { DeleteOutlined } from "@ant-design/icons";
import { Table, Popconfirm } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { localeNumber } from "@/utils/number";

export default function TransTable({ db, transactions }) {
	const [deleteTransacton, isTransactonLoading] = useLoading(async (id) => {
		await db.assets.delete(id);
	}, false);

	const columns = [
		{
			title: 'id',
			dataIndex: 'id',
			key: 'id',
			hidden: true
		},
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
			render: text => text.toLocaleDateString("ru-RU", { year: "numeric", month: "short", day: "numeric", })
		},
		{
			title: 'Токен',
			dataIndex: 'token',
			key: 'token',
			align: 'center'
		},
		{
			title: 'Кол-во',
			dataIndex: 'amount',
			key: 'amount',
			align: 'center',
			render: value => value > 0 ? value : <span className="warning">{value}</span>,
		},
		{
			title: 'Цена ($)',
			key: 'price',
			dataIndex: 'price',
			align: 'center'
		},
		{
			title: 'Сумма ($)',
			dataIndex: 'sum',
			key: 'sum',
			align: 'center',
			render: (_, row) => {
				// если продажа, то цифры красные
				let value = row.amount * row.price;
				return value > 0 ? localeNumber(value) : <span className="warning">{localeNumber(value)}</span>;
			},
			sorter: (a, b) => (a.amount * a.price) - (b.amount * b.price),
		},
		{
			title: '',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (_, row) => (
				<Popconfirm
					className="warning"
					disabled={isTransactonLoading}
					title="Удалить транзакцию?"
					onConfirm={() => deleteTransacton(row.id)}
					okText="Да"
					cancelText="Нет">
					<DeleteOutlined />
				</Popconfirm>
			),
		},
	].filter(item => !item.hidden);

	return (
		<Table
			rowKey="id"
			bordered
			size={"small"}
			columns={columns}
			dataSource={transactions}
			pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
		/>
	);
}
