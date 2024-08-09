import {
  appendPair,
  deletePair,
  getQuotes,
  updateQuotes,
} from "@/api/FetchService";
import { useFetching } from "@/hooks/useFetching";
import { useInterval } from "@/hooks/useInterval";
import { localeNumber } from "@/utils/number";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined,
  DownOutlined,
  FileAddOutlined,
  ReloadOutlined,
  UpOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Space,
} from "antd";
import { useEffect, useState } from "react";

const INTERVAL = 600;

export default function Quotes() {
  const [timer, setTimer] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [inputPair, setInputPair] = useState("");
  const [inputCheck, setInputCheck] = useState(null);
  const [showAddFrom, setShowAddForm] = useState(false);

  const [fetchQuotes, isQuotesLoading] = useFetching(async () => {
    let [data, status] = await getQuotes();
    status === "Success" && setQuotes(data);
  }, true);

  const [fetchQuotesUpdate, isQuotesUpdateLoading] = useFetching(async () => {
    setInputCheck(null);
    let [data, status] = await updateQuotes();
    status === "Success" && setQuotes(data);
  }, false);

  const [fetchAppendPair, isAppendPairLoading] = useFetching(async (pair) => {
    let [data, status] = await appendPair({ pair: pair });
    if (status === "Success") {
      setQuotes([...quotes, data]);
      setShowAddForm(false);
    }
  }, false);

  const [fetchDeletePair, isDeletePairLoading] = useFetching(async (pair) => {
    let [, status] = await deletePair({ pair: pair });
    status === "Success" && setQuotes(quotes.filter((o) => o.pair !== pair));
  }, false);

  useEffect(() => {
    fetchQuotes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useInterval(
    () => {
      setTimer(timer - 1);
      if (timer === 1) {
        fetchQuotesUpdate();
        setTimer(INTERVAL);
      }
    },
    timer > 0 && !isQuotesLoading && !isQuotesUpdateLoading ? 1000 : null
  );

  return (
    <Card
      loading={isQuotesLoading || isQuotesUpdateLoading}
      size="small"
      title="Quotes"
      className="quote-list"
      extra={
        <Space>
          <InputNumber
            disabled={isQuotesLoading || isQuotesUpdateLoading}
            style={{ maxWidth: 125 }}
            value={inputCheck}
            onChange={setInputCheck}
            min={0}
          />
          <Button
            loading={isQuotesUpdateLoading || isQuotesLoading}
            icon={<ReloadOutlined />}
            onClick={() => {
              setTimer(INTERVAL);
              fetchQuotesUpdate();
            }}
          />
          <Button
            type={timer > 0 ? "primary" : "default"}
            disabled={isQuotesUpdateLoading || isQuotesLoading}
            icon={<HistoryOutlined />}
            onClick={() => setTimer(timer > 0 ? 0 : INTERVAL)}
          >
            {" " + timer}
          </Button>
          <Button
            disabled={isQuotesLoading || isQuotesUpdateLoading}
            icon={showAddFrom ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setShowAddForm(!showAddFrom)}
          />
        </Space>
      }
    >
      <div
        className="edit-form"
        style={{ display: showAddFrom ? "block" : "none" }}
      >
        <Flex justify={"space-between"} gap={8}>
          <Input
            placeholder="BTC/USD"
            allowClear
            value={inputPair}
            onChange={(e) =>
              setInputPair(
                e.target.value.toUpperCase().replace(/[^A-Z0-9/]+/, "")
              )
            }
          />
          <Button
            type="primary"
            ghost
            icon={<FileAddOutlined />}
            onClick={() => fetchAppendPair(inputPair)}
            loading={isAppendPairLoading}
            disabled={!inputPair.length}
          />
        </Flex>
      </div>
      {!quotes.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      {quotes.map((o) => (
        <Row
          key={o.pair}
          gutter={[8, 8]}
          justify={"space-between"}
          align={"middle"}
        >
          <Col span={20}>
            <Flex justify={"space-between"}>
              <span>{o.pair}</span>
              <span style={{ width: 120 }}>
                {parseFloat(o.rate) > parseFloat(o.previous) ? (
                  <ArrowUpOutlined style={{ color: "green", marginRight: 5 }} />
                ) : (
                  <ArrowDownOutlined style={{ color: "red", marginRight: 5 }} />
                )}
                <span>
                  {inputCheck
                    ? localeNumber(o.rate * inputCheck)
                    : localeNumber(o.rate)}
                </span>
              </span>
            </Flex>
          </Col>
          <Col>
            <Popconfirm
              title="Delete the pair?"
              onConfirm={() => fetchDeletePair(o.pair)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ opacity: 0.5 }}
                type="text"
                loading={isDeletePairLoading}
                icon={<MinusOutlined />}
              />
            </Popconfirm>
          </Col>
        </Row>
      ))}
    </Card>
  );
}
