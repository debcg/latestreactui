import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import InvoicesPage from "./Pages/InvoicesPage";
import InvoiceQueue from "./Pages/InvoiceQueue";
import Login from "./Pages/Login";
import AuthenticatedLayout from "./Components/AuthenticatedLayout";
import "./styles.css";
import DashboardPage from "./Pages/DashboardPage";
import TouchlessProcessedPage from "./Pages/TouchlessProcessedPage";
import UnderProcessPage from "./Pages/UnderProcessPage";
import ManualQueuePage from "./Pages/ManualQueuePage";
import RejectedQueuePage from "./Pages/RejectedQueuePage";
import MetricDefinitionsPage from "./Pages/MetricDefinitionsPage";
import TouchlessProcessDetailsPage from "./Pages/TouchlessProcessDetailsPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Protected routes with AuthenticatedLayout */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invoice-queue" element={<InvoicesPage />}>
          <Route path="/invoice-queue" element={<InvoiceQueue />}></Route>
            <Route
              path="touchless-processed"
              element={<TouchlessProcessedPage />}
            />
            
            {/* <Route
              path="touchless-processed/:id"
              element={<TouchlessProcessDetailsPage />}
            /> */}
            <Route path="/invoice-queue/viewinvoice/:transaction_id/:invoiceId/:queueName" element={<TouchlessProcessDetailsPage />} />
            <Route path="under-process" element={<UnderProcessPage />} />
            <Route path="manual-queue" element={<ManualQueuePage />} />
            <Route path="rejected-queue" element={<RejectedQueuePage />} />
            
          </Route>
          <Route path="/metric-definitions" element={<MetricDefinitionsPage />} />
        </Route>

        {/* Login route */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Redirect to login if not authenticated */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
