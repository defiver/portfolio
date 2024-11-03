import { AppstoreAddOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import List from './List';
import "./style.css";

export default function WidgetsList(props) {
  const [showModal, setshowModal] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<AppstoreAddOutlined />}
        onClick={() => setshowModal(true)}
        title="Виджеты"
      />

      <Modal
        title="Виджеты"
        footer={null}
        open={showModal}
        onOk={() => setshowModal(false)}
        onCancel={() => setshowModal(false)}
        width={576}
        // style={{ top: 20 }}
        className={"widgets-list"}
        destroyOnClose={true}
      >
        <List {...props} />
      </Modal >
    </>
  );
}
