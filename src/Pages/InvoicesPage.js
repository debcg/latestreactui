import React from "react";
import { Outlet } from "react-router-dom";

const InvoicesPage = () => {
  return (
    <div className="invoice-queue-container">
      <Outlet />
    </div>
  );
};

export default InvoicesPage;
