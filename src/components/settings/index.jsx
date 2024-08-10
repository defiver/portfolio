import { SettingOutlined } from "@ant-design/icons";
import { FloatButton, Modal, Button, Space, Input, Flex } from "antd";
import { useState } from "react";
import { useDB } from "@/hooks/useDB";
import { importInto, exportDB } from "dexie-export-import";

const data = '{"formatName":"dexie","formatVersion":1,"data":{"databaseName":"porfolio","databaseVersion":1,"tables":[{"name":"journal","schema":"++id,daterange,text,tokens,income,tags,transaction,status,chain,link","rowCount":8},{"name":"tokens","schema":"token,amount,quote,previous","rowCount":9},{"name":"notes","schema":"++id,text,finish,order","rowCount":0}],"data":[{"tableName":"journal","inbound":true,"rows":[{"status":"active","daterange":[{"$L":"en","$u":0,"$d":1723237200000,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":0,"$m":0,"$s":0,"$ms":0,"$x":{},"$isDayjsObject":true},{"$L":"en","$u":0,"$d":1723410000000,"$y":2024,"$M":7,"$D":12,"$W":1,"$H":0,"$m":0,"$s":0,"$ms":0,"$x":{},"$isDayjsObject":true}],"tags":["uniswap","merkl"],"chain":["ARB"],"transaction":"https://arbiscan.io/tx/","tokens":[{"amount":1000,"token":"USDC"},{"amount":2000,"token":"FRAX"}],"link":"https://app.uniswap.org/pools/","id":1,"text":"Закинул $3000 в пул USDC/FRAX под награды","$types":{"daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date","daterange.1.$u":"undef","daterange.1.$d":"date","tags":"arrayNonindexKeys","chain":"arrayNonindexKeys","tokens":"arrayNonindexKeys"}},{"status":"active","tags":["deltaprime"],"tokens":[{"amount":2,"token":"ETH"}],"id":3,"link":"https://app.deltaprime.io/#/pools","transaction":"https://explorer.arbitrum.io/tx/","daterange":[{"$L":"en","$u":0,"$d":1723280296000,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":11,"$m":58,"$s":16,"$ms":0,"$x":{},"$isDayjsObject":true},null],"text":"Под проценты","chain":["ARB"],"$types":{"tags":"arrayNonindexKeys","tokens":"arrayNonindexKeys","daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date","chain":"arrayNonindexKeys"}},{"status":"active","tags":["aave"],"tokens":[{"token":"BTC","amount":0.11}],"id":6,"text":"Закину WBTC под залог","daterange":[{"$L":"en","$u":0,"$d":1723280336700,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":11,"$m":58,"$s":56,"$ms":700,"$x":{},"$isDayjsObject":true},null],"chain":["ARB"],"transaction":"https://arbiscan.io/tx/","link":"https://app.aave.com/","$types":{"tags":"arrayNonindexKeys","tokens":"arrayNonindexKeys","daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date","chain":"arrayNonindexKeys"}},{"status":"active","daterange":[{"$L":"en","$u":0,"$d":1723273384700,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":10,"$m":3,"$s":4,"$ms":700,"$x":{},"$isDayjsObject":true},{"$L":"en","$u":0,"$d":1727298000000,"$y":2024,"$M":8,"$D":26,"$W":4,"$H":0,"$m":0,"$s":0,"$ms":0,"$x":{},"$isDayjsObject":true}],"tags":["uniswap"],"tokens":[{"token":"USDT","amount":5000},{"amount":2,"token":"ETH"}],"id":7,"text":"В пару USDT/ETH","chain":["ARB"],"transaction":"https://arbiscan.io/tx/","link":"https://app.uniswap.org/pools/","$types":{"daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date","daterange.1.$u":"undef","daterange.1.$d":"date","tags":"arrayNonindexKeys","tokens":"arrayNonindexKeys","chain":"arrayNonindexKeys"}},{"status":"completed","tags":["deltaprime"],"tokens":[{"amount":10000,"token":"USDC"}],"id":9,"text":"Под проценты","daterange":[{"$L":"en","$u":0,"$d":1722459600000,"$y":2024,"$M":7,"$D":1,"$W":4,"$H":0,"$m":0,"$s":0,"$ms":0,"$x":{},"$isDayjsObject":true},{"$L":"en","$u":0,"$d":1723237200000,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":0,"$m":0,"$s":0,"$ms":0,"$x":"#daterange.0.$x","$isDayjsObject":true}],"transaction":"https://arbiscan.io/tx/","chain":["ARB"],"link":"https://app.deltaprime.io/#/pools","income":50,"$types":{"tags":"arrayNonindexKeys","tokens":"arrayNonindexKeys","daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date","daterange.1.$u":"undef","daterange.1.$d":"date","daterange.1.$x":"#","chain":"arrayNonindexKeys"}},{"status":"active","tags":["nostra"],"tokens":[{"token":"STRK","amount":1000}],"id":10,"text":"Под проценты и награды","transaction":"https://starkscan.co/tx/","link":"https://app.nostra.finance/","chain":["STARKNET"],"daterange":[{"$L":"en","$u":0,"$d":1723280478000,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":12,"$m":1,"$s":18,"$ms":0,"$x":{},"$isDayjsObject":true},null],"$types":{"tags":"arrayNonindexKeys","tokens":"arrayNonindexKeys","chain":"arrayNonindexKeys","daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date"}},{"status":"active","tags":["aave"],"tokens":[{"token":"USDC","amount":-3000}],"id":11,"text":"Взял в кредит под залог BTC","daterange":[{"$L":"en","$u":0,"$d":1723280664700,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":12,"$m":4,"$s":24,"$ms":700,"$x":{},"$isDayjsObject":true},null],"transaction":"https://arbiscan.io/tx/","link":"https://app.aave.com/","chain":["ARB"],"$types":{"tags":"arrayNonindexKeys","tokens":"arrayNonindexKeys","daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date","chain":"arrayNonindexKeys"}},{"status":"active","daterange":[{"$L":"en","$u":0,"$d":1723280674600,"$y":2024,"$M":7,"$D":10,"$W":6,"$H":12,"$m":4,"$s":34,"$ms":600,"$x":{},"$isDayjsObject":true},null],"tags":["sushi"],"chain":["BASE"],"tokens":[{"amount":1000,"token":"DAI"},{"amount":2000,"token":"USDC"}],"id":12,"text":"Закинул $3000 в пару DAI/USDC","transaction":"https://arbiscan.io/tx/","link":"https://www.sushi.com/pool/","$types":{"daterange":"arrayNonindexKeys","daterange.0.$u":"undef","daterange.0.$d":"date","tags":"arrayNonindexKeys","chain":"arrayNonindexKeys","tokens":"arrayNonindexKeys"}}]},{"tableName":"tokens","inbound":true,"rows":[{"token":"ARB","amount":1200,"previous":0.5795496,"quote":0.5795496},{"token":"BTC","amount":0.1100000000000001,"previous":60729.5,"quote":60729.5},{"token":"DAI","amount":5000,"previous":0.9997908,"quote":0.9997908},{"token":"ETH","amount":4,"previous":2625.057,"quote":2625.057},{"token":"FRAX","amount":5000,"previous":0.997429,"quote":0.997429},{"token":"STRK","amount":1000,"previous":0.3844517,"quote":0.3844517},{"token":"TON","amount":500,"previous":6.768237,"quote":6.768237},{"token":"USDC","amount":0,"previous":0.9999558,"quote":0.9999558},{"token":"USDT","amount":5000,"previous":1.000181,"quote":1.000181}]},{"tableName":"notes","inbound":true,"rows":[]}]}}';

export default function Settings({ db }) {
  const [swowModal, setSwowModal] = useState(false);

  const [clearData, isClearDataLoading] = useDB(async () => {
    await db.notes.clear();
    await db.tokens.clear();
    await db.journal.clear();
  }, false);

  const [importData, isImportDataLoading] = useDB(async () => {
    const bytes = new TextEncoder().encode(data);
    const blob = new Blob([bytes], { type: "application/json;charset=utf-8" });
    await clearData();
    await importInto(db, blob);
  }, false);

  const [exportData, isExportDataLoading] = useDB(async () => {
    const blob = await exportDB(db);
    console.log(await blob.text());
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
        style={{ top: 20 }}
      >
        <Flex vertical gap={16}>
          <Space>
            <Button onClick={importData} loading={isImportDataLoading}>Import test data</Button>
            <Button disabled onClick={exportData} loading={isExportDataLoading}>Export data</Button>
            <Button onClick={clearData} loading={isClearDataLoading}>Clear data</Button>
          </Space>
          <Input.TextArea spellCheck={false} rows={10} maxLength={6} value={JSON.stringify(JSON.parse(data), null, 4)} />
        </Flex>
      </Modal>
    </>
  );
}
