import React, { useState } from "react";
import { Layout, Menu, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import Logo from "../images/caplogo.png";
import {
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "../index.css";
const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState(["invoice-queue"]);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const siderClass = darkMode ? "bg-gray-900" : "bg-white";
  const textClass = darkMode ? "text-white" : "text-[#1e2f49]";

  const renderMenuItem = (path, label) => {
    const isSelected = location.pathname === path;
    const itemClass = collapsed ? "relative pl-6" : "pl-12 relative";

    return (
      <Menu.Item
        key={path}
        className={`${itemClass} ${isSelected ? "bg-[#0070ad] text-white" : ""}`}
      >
        <Link to={path} style={{ color: isSelected ? "white" : "inherit" }}>
          {label}
        </Link>
      </Menu.Item>
    );
  };

  return (
    <Sider
      width={236}
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      className={`${siderClass} min-h-screen`}
      trigger={null}
    >
      <div className="p-4 flex justify-between items-center">
        <img src={Logo} alt="Logo" className={`${collapsed ? "w-8" : "w-56"}`} />

        {collapsed ? (
           <LeftOutlined 
            onClick={toggleCollapsed}
            className="text-[#000000] text-xl cursor-pointer"
            style={{ marginTop: "-25px", background: "#fff", borderRadius: "50%", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", fontSize:"12px", padding:"5px", marginLeft:"5px" }}

          />
        ) : (
          <RightOutlined 
            onClick={toggleCollapsed}
            className="text-[#000000] text-xl cursor-pointer"
            style={{ marginTop: "-25px", background: "#fff", borderRadius: "50%", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", fontSize:"12px", padding:"5px", marginLeft:"5px" }}
          />
        )}
      </div>

      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={[location.pathname]}
        className={`${siderClass} ${textClass} border-r-0`}
        style={{ backgroundColor: darkMode ? "#333" : "white" }}
      >
        <Menu.Item
          key="/dashboard"
          icon={<DashboardOutlined />}
          className={location.pathname === "/dashboard" ? "bg-[#0070ad] text-white" : ""}
        >
          <Link to="/dashboard" style={{ color: location.pathname === "/dashboard" ? "white" : "inherit" }}>
            Dashboard
          </Link>
        </Menu.Item>

        <SubMenu
          key="invoice-queue"
          icon={<FileTextOutlined />}
          title="Invoice Queue"
          className={siderClass}
        >
          {renderMenuItem("/invoice-queue/touchless-processed", "Touchless Processed")}
          {renderMenuItem("/invoice-queue/under-process", "Under Process")}
          {renderMenuItem("/invoice-queue/manual-queue", "Manual Queue")}
          {renderMenuItem("/invoice-queue/rejected-queue", "Rejected Queue")}
         
        </SubMenu>

        <Menu.Item
          key="/match-definitions"
          icon={<SettingOutlined />}
          className={location.pathname === "/match-definitions" ? "bg-[#0070ad] text-white" : ""}
        >
          <Link to="/match-definitions" style={{ color: location.pathname === "/match-definitions" ? "white" : "inherit" }}>
            Match Definitions
          </Link>
        </Menu.Item>
      </Menu>

      {/* Dark mode toggle */}
      <div className="absolute bottom-4 left-2 right-2">
        {collapsed ? (
          <Tooltip title="Switch Mode" placement="right">
            <div
              className="w-8 h-8 rounded-full bg-[#4C9AFF] flex items-center justify-center cursor-pointer mx-auto"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <BulbFilled className="text-white" />
              ) : (
                <BulbOutlined className="text-white" />
              )}
            </div>
          </Tooltip>
        ) : (
          <>
            {/* <div
              className={`w-16 h-6 rounded-full bg-[#4C9AFF] flex items-center cursor-pointer mx-auto ${
                darkMode ? "justify-end" : "justify-start"
              }`}
              onClick={toggleDarkMode}
            >
              <div className="w-4 h-4 rounded-full bg-white m-1"></div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">
              Switch Mode
            </div> */}
          </>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
