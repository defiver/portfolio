import { DownloadOutlined } from "@ant-design/icons";
import { FloatButton, Modal } from "antd";
import { useState } from "react";
import Backup from './backup';

export default function Settings({ db }) {
  const [swowModal, setSwowModal] = useState(false);

  return (
    <>
      <FloatButton
        onClick={() => setSwowModal(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 60 }}
        icon={<DownloadOutlined />}
      />

      <Modal
        title="Backup"
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
