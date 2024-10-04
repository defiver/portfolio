import { DownloadOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import Backup from './backup';

export default function Settings({ db }) {
  const [swowModal, setSwowModal] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<DownloadOutlined />}
        onClick={() => setSwowModal(true)}
      />

      <Modal
        title="База данных"
        footer={null}
        open={swowModal}
        onOk={() => setSwowModal(false)}
        onCancel={() => setSwowModal(false)}
        width={300}
      >
        <Backup db={db} />
      </Modal >
    </>
  );
}
