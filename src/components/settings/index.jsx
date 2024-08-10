import { SettingOutlined } from "@ant-design/icons";
import { FloatButton, Modal, Button, Flex, Popconfirm } from "antd";
import { useState, useRef } from "react";
import { useDB } from "@/hooks/useDB";
import { importInto, exportDB } from "dexie-export-import";
import test from './test.json';

export default function Settings({ db }) {
  const [swowModal, setSwowModal] = useState(false);
  const inputRef = useRef();

  const [clearData, isClearDataLoading] = useDB(async () => {
    await db.notes.clear();
    await db.tokens.clear();
    await db.journal.clear();
  }, false);

  const saveData = async (blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "portfolio.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const uploadData = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      importData(JSON.parse(e.target.result));
    };
  };

  const [importData, isImportDataLoading] = useDB(async (data) => {
    const bytes = new TextEncoder().encode(JSON.stringify(data));
    const blob = new Blob([bytes], { type: "application/json;charset=utf-8" });
    await clearData();
    await importInto(db, blob);
  }, false);

  const [exportData, isExportDataLoading] = useDB(async () => {
    const blob = await exportDB(db);
    await saveData(blob)
  }, false);

  return (
    <>
      <FloatButton
        onClick={() => setSwowModal(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 72 }}
        icon={<SettingOutlined />}
      />

      <Modal
        title="Settings"
        footer={null}
        open={swowModal}
        onOk={() => setSwowModal(false)}
        onCancel={() => setSwowModal(false)}
        width={300}
      >
        <Flex vertical gap={16}>
          <Button onClick={() => importData(test)} loading={isImportDataLoading}>Import test data</Button>

          <Button onClick={exportData} loading={isExportDataLoading}>Export data</Button>

          <Button onClick={() => inputRef.current.click()}>Import data</Button>
          <input onChange={uploadData} multiple={false} ref={inputRef} type="file" hidden />

          <Popconfirm
            title="Delete all data?"
            onConfirm={() => clearData(clearData)}
            okText="Yes"
            cancelText="No"
          >
            <Button loading={isClearDataLoading}>Clear data</Button>
          </Popconfirm>
        </Flex>
      </Modal >
    </>
  );
}
