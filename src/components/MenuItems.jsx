import { useLocation } from "react-router";
import { Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  SwapOutlined,
  ArrowsAltOutlined,
  ArrowRightOutlined,
  FileDoneOutlined,
  PictureOutlined,
  HistoryOutlined,
  } from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import 'remixicon/fonts/remixicon.css';

function MenuItems() {
  const { pathname } = useLocation();
  const { SubMenu } = Menu;

  return (

    <Menu
      mode="inline-flex"
      theme="light"
      mode="horizontal"
      style={{
        display: "inline",
        fontWeight: "400",
        width: "100%",
        maxWidth: "800px",
        justifyContent: "left",
        background: "transparent",
        color: "#333",
        border: "0px",
        text: {
        },
      }}

      defaultSelectedKeys={[pathname]}
    >



    {/* Defines the menu items to display on the header. */}

    <Menu.Item key="/swap" icon={<SwapOutlined style={{color: "#FFF"}} />}>
    <NavLink to="/swap">Swap</NavLink>
    </Menu.Item>

    <Menu.Item key="/transfer" icon={<ArrowRightOutlined style={{color: "#FFF"}} />}>
    <NavLink to="/transfer">Transfer</NavLink>
    </Menu.Item>

    <Menu.Item key="/portfolio" icon={<FileDoneOutlined style={{color: "#FFF"}} />}>
    <NavLink to="/portfolio">My Portfolio</NavLink>
    </Menu.Item>

    <Menu.Item key="/nfts" icon={<PictureOutlined style={{color: "#FFF"}} />}>
    <NavLink to="/nfts">My NFTs</NavLink>
    </Menu.Item>

    <Menu.Item key="/activity" icon={<HistoryOutlined style={{color: "#FFF"}} />}>
    <NavLink to="/activity">Account Activity</NavLink>
    </Menu.Item>

    <Menu.Item icon={<ArrowsAltOutlined style={{color: "#FFF"}} />}>
    <a href="https://app.multichain.org/#/router" target="_blank">Bridge</a>
    </Menu.Item>

    </Menu>

  );
}

export default MenuItems;
