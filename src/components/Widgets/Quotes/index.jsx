import { DownOutlined, UpOutlined, AreaChartOutlined } from "@ant-design/icons";
import { Button, Card, Drawer } from "antd";
import { useState } from "react";
import AddForm from './AddForm';
import PairsList from './PairsList';
import "./style.css";

export default function Quotes({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<AreaChartOutlined />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="quotes"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
        destroyOnClose={true}
      >
        <Card
          size="small"
          title="Котировки"
          className="quotes-list"
          extra={
            <Button
              icon={showAddForm ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setShowAddForm(!showAddForm)}
              title="Добавить пару"
            />
          }
        >
          {showAddForm && <AddForm db={db} setShowAddForm={setShowAddForm} />}

          <PairsList db={db} />
        </Card>
      </Drawer>
    </>
  );
}
