import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "14px",
        fontWeight: "500",
        width: "60%",
        justifyContent: "center",
        borderBottom: "0px",
        background: "#4054B2",
        color: "#000",
        text: {
          color: "#FFF",
        },
      }}
      defaultSelectedKeys={[pathname]}
    >
    <Menu.Item key="/exchange">
      <NavLink to="/exchange">Exchange</NavLink>
    </Menu.Item>
      <Menu.Item key="/wallet">
        <NavLink to="/wallet">Transfer</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20balance">
        <NavLink to="/erc20balance">My Portfolio</NavLink>
      </Menu.Item>
      <Menu.Item key="/nftBalance">
        <NavLink to="/nftBalance">My NFTs</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20transfers">
        <NavLink to="/erc20transfers">Account Activity</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
