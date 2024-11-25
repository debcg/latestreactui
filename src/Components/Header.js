import React from "react";
import { Layout, Typography, Input, Badge, Avatar } from "antd";
import { SearchOutlined, BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import { create } from "zustand";

const { Header } = Layout;
const { Title } = Typography;

export const useHeaderStore = create((set) => ({
  tabTitle: null,
  setTabTitle: (title) => set({ tabTitle: title }),
  clearTabTitle: () => set({ tabTitle: null }),
}));

const HeaderComponent = () => {
  const location = useLocation();
  const params = useParams();
  const { tabTitle } = useHeaderStore();

  const getRouteBasedTitle = () => {
    const basePath = location.pathname.replace(/\/\d+$/, "");
    let baseTitle = "";

    switch (basePath) {
      case "/dashboard":
        return "DASHBOARD";
      case "/invoice-queue/touchless-processed":
        baseTitle = "INVOICE QUEUE - TOUCHLESS PROCESSED";
        break;
      case "/invoice-queue/under-process":
        baseTitle = "INVOICE QUEUE - UNDER PROCESS";
        break;
      case "/invoice-queue/manual-queue":
        baseTitle = "INVOICE QUEUE - MANUAL QUEUE";
        break;
      case "/invoice-queue/rejected-queue":
        baseTitle = "INVOICE QUEUE - REJECTED QUEUE";
        break;
      case "/match-definitions":
        return "MATCH DEFINITIONS";
      default:
        return "DASHBOARD";
    }

    if (tabTitle) {
      const tabTitleWithoutPrefix = tabTitle.replace(/^Invoice Queue - /, "");
      return `${baseTitle} > ${tabTitleWithoutPrefix.toUpperCase()}`;
    }

    return baseTitle;
  };

  const displayTitle = getRouteBasedTitle();

  return (
    <Header className="bg-[#0070AD] shadow-md flex items-center justify-between px-6"  style={{ height: "50px" }}>
      <Title
        level={5}
        className="m-0 text-[#ffff] uppercase tracking-wide"
        style={{ color: "white" }}
      >
        {displayTitle}
      </Title>
      <div className="flex items-center space-x-4">
        {/* <Input
          prefix={<SearchOutlined className="text-gray-400" />} 
          placeholder="search...."
          className="rounded-full bg-gray-100 border-0"
        /> */}
        <SearchOutlined className="text-gray-400" style={{color:"white"}}/>
        <Badge dot>
          <BellOutlined className="text-xl text-[#ffff]" />
        </Badge>
        <Avatar src="/api/placeholder/32/32" alt="User Avatar" className="w-8" >
           AM
        </Avatar>
        {/* <Badge dot color="green">
          <Avatar className="bg-blue-500 text-white" size="large">
            AM
          </Avatar>
        </Badge> */}

         <LogoutOutlined className="text-xl text-white cursor-pointer" />
      </div>
    </Header>
  );
};

export default HeaderComponent;
