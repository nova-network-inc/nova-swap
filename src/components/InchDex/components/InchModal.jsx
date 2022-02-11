import React, { useEffect, useState } from "react";
import { Input } from 'antd'

const styles = {
  input: {
    padding: "0",
    fontWeight: "500",
    fontSize: "23px",
    display: "block",
    width: "100%",
  },
};

function InchModal({ open, onClose, setToken, tokenList }) {
  const [filteredList, setFilteredList] = useState(null)
  const [search, setSearch] = useState()
  useEffect(() => {
    if (tokenList && search && search !== '') {
      try {
        const tokenArr = Object.keys(tokenList).map((token) =>({...tokenList[token]}))
        const list = tokenArr.filter(({ name, symbol }) => (name?.toLowerCase()?.includes(search) || symbol?.toLowerCase()?.includes(search)))
        setFilteredList(list)
      } catch (err) {
        console.log(err)
        setFilteredList(null)
      }
    } else {
      setFilteredList(null)
    }
  }, [search, tokenList])

  const modalTokenList = filteredList ? filteredList : tokenList
  if (!open) return null;

  return (
    <div style={{ overflow: "auto", height: "500px" }}>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ ...styles.input, paddingLeft: 20 }}
      />
      {!modalTokenList
        ? null
        : Object.keys(modalTokenList).map((token, index) => (
            <div
              style={{
                padding: "5px 20px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                setToken(modalTokenList[token]);
                onClose();
              }}
              key={index}
            >
              <img
                style={{
                  height: "32px",
                  width: "32px",
                  marginRight: "20px",
                }}
                src={modalTokenList[token].logoURI}
                alt="noLogo"
              />
              <div>
                <h4>{modalTokenList[token].name}</h4>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "14px",
                  }}
                >
                  {modalTokenList[token].symbol}
                </span>
              </div>
            </div>
          ))}
    </div>
  );
}

export default InchModal;
