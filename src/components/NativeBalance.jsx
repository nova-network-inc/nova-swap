import { useNativeBalance } from "react-moralis";

function NativeBalance(props) {
  const { data: balance } = useNativeBalance(props);
  return <div style={{ textAlign: "center", whiteSpace: "nowrap", color: "#FFF", fontWeight: "500", fontSize: "12px" }}>{balance.formatted}</div>;
}

export default NativeBalance;
