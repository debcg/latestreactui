import React from "react";
import { Outlet } from "react-router-dom"; // To render child routes
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import HeaderComponent from "./Header";
import FooterComponent from "./Footer";

const AuthenticatedLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        style={{ height: "100vh", position: "fixed", left: 0, top: 0 }}
      />
      <Layout>
        {" "}
        <HeaderComponent />
        <Layout.Content
          style={{
            padding: "10px",

            overflowY: "auto",
            height: "calc(100vh - 90px - 48px)",
          }}
        >
          <Outlet />
        </Layout.Content>
        <FooterComponent style={{ position: "fixed", left: 0, bottom: 0 }} />
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
