// My Portfolio

import { useMoralis, useERC20Balances } from "react-moralis";
import { Skeleton, Table } from "antd";
import { getEllipsisTxt } from "../helpers/formatters";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
    padding: "10px",
  },
};

{/* The function below pulls all the information on the users ERC-20 token balances. */}
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

{/* ---------- HTML Rendering Starts*/}
return (
  <div style={{ width: "1000px", padding: "0px" }}>
    <Skeleton loading={!assets}>
    <Table
      dataSource={assets}
      columns={columns}
      rowKey={(record) => {return record.token_address;}}
    />
    </Skeleton>
  </div>
  );
}
{/* ---------- HTML Rendering Ends*/}
export default ERC20Balance;
