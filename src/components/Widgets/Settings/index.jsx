import { DownloadOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import Backup from './Backup';

export default function Settings({ db }) {
  const [showModal, setshowModal] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<DownloadOutlined />}
        onClick={() => setshowModal(true)}
      />

      <Modal
        title="База данных"
        footer={null}
        open={showModal}
        onOk={() => setshowModal(false)}
        onCancel={() => setshowModal(false)}
        width={300}
      >
        <Backup db={db} />
      </Modal >
    </>
  );
}
