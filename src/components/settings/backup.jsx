import { Button, Flex, Popconfirm } from "antd";
import { useRef } from "react";
import { useLoading } from "@/hooks/useLoading";
import { importInto, exportDB } from "dexie-export-import";
import test from './test.json';

// таблицы, которые не экспортируются, так как имеют большой размер и в них нет пользовательских данных
const filterTables = ["merkl", "llama", "sushi"];

export default function Backup({ db }) {
	const inputRef = useRef();

	const [clearData, isClearDataLoading] = useLoading(async () => {
		await db.tables.forEach((table) => db[table.name].clear());
		await db.delete({ disableAutoOpen: false });
	}, false);

	// сохранение базы через blob в json
	const saveData = async (blob) => {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = "portfolio.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// загрузка данных из json
	const uploadData = (e) => {
		const fileReader = new FileReader();
		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e) => {
			importData(JSON.parse(e.target.result));
		};
	};

	const [importData, isImportDataLoading] = useLoading(async (data) => {
		const bytes = new TextEncoder().encode(JSON.stringify(data));
		const blob = new Blob([bytes], { type: "application/json;charset=utf-8" });
		await clearData();
		await importInto(db, blob);
	}, false);

	const [exportData, isExportDataLoading] = useLoading(async () => {
		const blob = await exportDB(db, { filter: (table) => !filterTables.includes(table) });
		await saveData(blob)
	}, false);

	const disable = isImportDataLoading || isExportDataLoading || isClearDataLoading;

	return (
		<Flex vertical gap={16}>
			<Button
				onClick={exportData}
				loading={isExportDataLoading}
				disabled={disable}
			>Экспортировать данные</Button>

			<Button
				onClick={() => inputRef.current.click()}
				loading={isImportDataLoading}
				disabled={disable}
			>Импортировать данные</Button>
			<input onChange={uploadData} multiple={false} ref={inputRef} type="file" hidden />

			<Button
				onClick={() => importData(test)}
				loading={isImportDataLoading}
				disabled={disable}
			>Импортировать тестовые данные</Button>

			<Popconfirm
				title="Точно?"
				onConfirm={() => clearData(clearData)}
				okText="Да"
				cancelText="Нет"
			>
				<Button loading={isClearDataLoading} disabled={disable}>Стереть данные</Button>
			</Popconfirm>
		</Flex>
	);
}
