import { AppstoreAddOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Modal, Card, Flex } from "antd";
import { useState } from "react";
import { saveStorage } from '@/utils/storage';
import "./style.css";

export default function WidgetsList({ widgets, favorites, setFavorites }) {
  const [swowModal, setSwowModal] = useState(false);

  const setFavorite = (key) => {
    let nfavs = favorites.includes(key) ? favorites.filter(i => i !== key) : [...favorites, key];
    saveStorage("favorite_widgets", nfavs) && setFavorites(nfavs);
  }

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<AppstoreAddOutlined />}
        onClick={() => setSwowModal(true)}
      />

      <Modal
        title="Виджеты"
        footer={null}
        open={swowModal}
        onOk={() => setSwowModal(false)}
        onCancel={() => setSwowModal(false)}
        width={440}
        className={"widgets-modal"}
        destroyOnClose={true}
      >
        <Flex gap={16} wrap>
          {
            widgets.map(o => {
              return (
                <Card size={"small"} key={o.key}>
                  {o.component}
                  <p>{o.name}</p>
                  <StarOutlined
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
      </Modal >
    </>
  );
}
