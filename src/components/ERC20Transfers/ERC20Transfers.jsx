import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "../../helpers/formatters";
import useNativeTransactions from "hooks/useNativeTransactions";
import { getExplorer } from "../../helpers/networks";
import "antd/dist/antd.css";
import { Skeleton, Table } from "antd";
import { useERC20Transfers } from "hooks/useERC20Transfers";

function ERC20Transfers() {
  const { ERC20Transfers, chainId } = useERC20Transfers();
  const { nativeTransactions, getNativeTransations, isLoading } = useNativeTransactions();
  const { Moralis } = useMoralis();

  useEffect(() => {
    if (!isLoading && getNativeTransations) {
      getNativeTransations()
    }
  }, [isLoading, getNativeTransations])

  const columnsnative = [
    {
      title: 'From',
      dataIndex: 'from_address',
      key: 'from_address',
      render: from => (
        getEllipsisTxt(from, 5)
      )
    },
    {
      title: 'To',
      dataIndex: 'to_address',
      key: 'to_address',
      render: to => (
        getEllipsisTxt(to, 5)
      )
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: value => (
          // missing second argument in FromWei, decimals
        parseFloat(Moralis.Units.FromWei(value).toFixed(6))
      )
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      render: hash => (
        <a
          href={
            chainId === "0x1" ? `https://etherscan.io/tx/${hash}` :
            chainId === "0x38" ? `https://bscscan.com/tx/${hash}` :
            chainId === "0x89" ? `https://polygonscan.com/tx/${hash}` :
            chainId === "0xfa" ? `https://ftmscan.com/tx/${hash}` :
            `https://explorer.avax.network/search?query=${hash}`
          }
          target="_blank"
          rel="noreferrer"
        >
          View Transaction
        </a>
      )
    }
  ]

  const columns = [
    {
      title: "Token",
      dataIndex: "address",
      key: "address",
      render: (token) => getEllipsisTxt(token, 8),
    },
    {
      title: "From",
      dataIndex: "from_address",
      key: "from_address",
      render: (from) => getEllipsisTxt(from, 8),
    },
    {
      title: "To",
      dataIndex: "to_address",
      key: "to_address",
      render: (to) => getEllipsisTxt(to, 8),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value, item) => parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: "Hash",
      dataIndex: "transaction_hash",
      key: "transaction_hash",
      render: (hash) => (
        <a href={`${getExplorer(chainId)}tx/${hash}`} target="_blank" rel="noreferrer">
          View Transaction
        </a>
      ),
    },
  ];

  let key = 0;
  return (
    <div style={{ width: "1000px", padding: "0px" }}>
    <h2>Token Transactions</h2>
    <br />
      <Skeleton loading={!ERC20Transfers}>
        <Table
          dataSource={ERC20Transfers}
          columns={columns}
          rowKey={(record) => {
            key++;
            return `${record.transaction_hash}-${key}`;
          }}
        />
      </Skeleton>
      <h2>Native Transactions</h2>
      <br />
      <Skeleton loading={!nativeTransactions || nativeTransactions.length === 0}>
        <Table
          dataSource={nativeTransactions}
          columns={columnsnative}
          rowKey={(record) => {
            key++;
            return `${record.transaction_hash}-${key}`;
          }}
        />
      </Skeleton>
    </div>
  );
}

export default ERC20Transfers;
