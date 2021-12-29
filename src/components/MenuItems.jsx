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
        fontSize: "13px",
        fontWeight: "300",
        width: "flex",
        justifyContent: "center",
        borderBottom: "0px",
        background: "#333",
        color: "#000",
        text: {
          color: "#FFF",
        },
      }}
      defaultSelectedKeys={[pathname]}
    >
    {/* Defines the menu items to display on the header. */}

    <Menu.Item key="/swap">
    <NavLink to="/swap">MultiSwap</NavLink>
    </Menu.Item>

    <Menu.Item key="/transfer">
    <NavLink to="/transfer">Transfer</NavLink>
    </Menu.Item>

    <Menu.Item key="/portfolio">
    <NavLink to="/portfolio">My Portfolio</NavLink>
    </Menu.Item>

    <Menu.Item key="/nfts">
    <NavLink to="/nfts">My NFTs</NavLink>
    </Menu.Item>

    <Menu.Item key="/activity">
    <NavLink to="/activity">Account Activity</NavLink>
    </Menu.Item>

    </Menu>
  );
}

export default MenuItems;
