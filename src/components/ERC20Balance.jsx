// My Portfolio

import { useMoralis, useERC20Balances } from "react-moralis";
import { useNativeBalance } from "react-moralis";
import { Skeleton, Table } from "antd";
import { getEllipsisTxt } from "../helpers/formatters";

// Function to display the native network balance.
function NativeBalance(props) {
  const { data: balance } = useNativeBalance(props);
  return <span>{balance.formatted}</span>;
}

// The function below pulls all the information on the users ERC-20 token balances.
function ERC20Balance(props) {
  const { data: assets } = useERC20Balances(props);
  const { Moralis } = useMoralis();
  const columns = [
  {
    title: "",
    dataIndex: "logo",
    key: "logo",
    render: (logo) => (
    <img src={logo || "/img/512Blank.png"} alt="nologo" width="28px" height="28px" />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name) => name,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    render: (symbol) => symbol,
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    render: (value, item) =>
      parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
  },
  {
    title: "Address",
    dataIndex: "token_address",
    key: "token_address",
    render: (address) => getEllipsisTxt(address, 5),
  },

  ];

// ---------- HTML Rendering Starts
return (

  <div  style={{ textAlign: "left", whiteSpace: "nowrap", color: "#000", fontWeight: "500", fontSize: "14px" }}>
    <p><b>Native Balance:</b> <NativeBalance /></p>
    <br />
    <div style={{ width: "1000px", padding: "0px", borderRadius: "30px" }}>
      <Skeleton loading={!assets}>
      <Table
        dataSource={assets}
        columns={columns}
        rowKey={(record) => {return record.token_address;}}
        />
        </Skeleton>
    </div>
  </div>
  );
}
// ---------- HTML Rendering Ends
export default ERC20Balance;
