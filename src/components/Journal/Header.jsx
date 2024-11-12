import { DownOutlined, FileZipOutlined, UpOutlined, BarChartOutlined } from "@ant-design/icons";
import { Button, Select, Flex } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { chainsState, idState, filterState, tagsState, tokensState } from "./store";

export default function Header({ showChart, setShowChart }) {
  const [filter, setFilterState] = useRecoilState(filterState);
  const [id, setId] = useRecoilState(idState);
  const tags = useRecoilValue(tagsState);
  const chains = useRecoilValue(chainsState);
  const tokens = useRecoilValue(tokensState);

  return (
    <Flex gap={8} justify="space-between" style={{ overflow: "auto", width: "100%" }}>
      <Flex gap={8} justify={"flex-start"}>
        <Select
          allowClear
          showSearch
          style={{ width: 150 }}
          placeholder="Тег"
          value={filter.tag}
          onChange={(value) => setFilterState({ ...filter, tag: value })}
          options={tags.map((i) => new Object({ label: i, value: i }))}
        />
        <Select
          allowClear
          showSearch
          style={{ width: 100 }}
          placeholder="Токен"
          value={filter.token}
          onChange={(value) => setFilterState({ ...filter, token: value })}
          options={tokens.map((i) => new Object({ label: i, value: i }))}
        />
        <Select
          allowClear
          showSearch
          style={{ width: 100 }}
          placeholder="Сеть"
          value={filter.chain}
          onChange={(value) => setFilterState({ ...filter, chain: value })}
          options={chains.map((i) => new Object({ label: i, value: i }))}
        />
      </Flex>
      <Flex gap={4} justify="end">
        <Button
          type={showChart ? "primary" : "default"}
          icon={<BarChartOutlined />}
          onClick={() => setShowChart(!showChart)}
          title="График доходов за последний год"
        />
        <Button
          type={filter.status ? "default" : "primary"}
          icon={<FileZipOutlined />}
          onClick={() => setFilterState({ ...filter, status: !filter.status })}
          title="Архив записей"
        />
        <Button
          icon={id === 0 ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setId(id === 0 ? null : 0)}
          title="Добавить запись"
        />
      </Flex>
    </Flex>
  );
}
