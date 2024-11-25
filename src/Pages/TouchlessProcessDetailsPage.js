import React, { useEffect, useState } from "react";
import { Tabs, Table, Card, Row, Col, Button, Input } from "antd";
import {
  FileText,
  CheckCircle,
  Database,
  RefreshCw,
  GitCompare,
  CheckSquare,
} from "lucide-react";
import { EditOutlined } from "@ant-design/icons";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import ValidateWithERP from "./ValidateWithERP";
import { create } from "zustand";
import { useHeaderStore } from "../Components/Header";
import RejectionNotification from "./RejectionNotification";
import axios from "axios";
import ExtractionTab from "./ExtractionTab";    
import ValidateTab from "./ValidateTab";
import ErpDataTab from "./ErpDataTab";
import InvoicePostedTab from "./InvoicePostedTab";
import NWayMatching from "./NWayMatching";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { TabPane } = Tabs;



const TouchlessProcessDetailsPage = () => {
  

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { setTabTitle, clearTabTitle } = useHeaderStore();
  const [activeTab, setActiveTab] = useState("invoice-received");
  const [isEditing, setIsEditing] = useState(false);
  const [tabData, setTabData] = useState(null);

  useEffect(() => {
    return () => {
      clearTabTitle();
    };
  }, [clearTabTitle]);

  // Fetch data from API
  useEffect(() => {
    const fetchTabData = async () => {
      try {
        const response = await axios.post(
          "https://p2p-ui-invoice-handle.azurewebsites.net/api/query_transaction",
          {
            transaction_id: "1130985_20241118043616188578xzN0H.pdf",
            invoiceId: "1130985",
            current: 0,
          }
        );
        setTabData(response.data);
      } catch (error) {
        console.error("Error fetching extraction data:", error);
      }
    };

    fetchTabData();
  }, []);
  

  
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  

  const tabs = [
    {
      key: "invoice-received",
      label: "Invoice Received",
      headerTitle: "Invoice Queue - Invoice Received",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
    },
    {
      key: "extraction",
      label: "Extraction",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
      headerTitle: "Invoice Queue - Extraction",
    },
    {
      key: "validation",
      label: "Validation",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
      headerTitle: "Invoice Queue - Validation",
    },
    {
      key: "erp-data",
      label: "ERP Data",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
      headerTitle: "Invoice Queue - ERP Data",
    },
    {
      key: "validate-with-erp",
      label: "Validate with ERP",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
      headerTitle: "Invoice Queue - ERP Validation",
    },
    {
      key: "n-way-matching",
      label: "N-Way Matching",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
      headerTitle: "Invoice Queue - N-Way Matching",
    },
    {
      key: "Rejection Notification",
      label: "Rejection Notification",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
      headerTitle: "Invoice Queue - Rejection Notification",
    },
    {
      key: "invoice-posted",
      label: "Invoice Posted",
      icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
      headerTitle: "Invoice Queue - Posted",
    },
  ];
  
  const renderTabContent = (tabKey) => {
    switch (tabKey) {
      case "invoice-received":
      return (
        <div>
         
          {!tabData ? (
            <div className="flex justify-center items-center h-full">
              <span>Loading...</span> 
            </div>
          ) : (
            <>
              {/* Transaction Details */}
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-xl font-semibold pb-2" style={{ color: "#0070AD", fontSize: "14px" }}>
                  INVOICE RECEIVED
                </h2>
                {/* Render transaction_time dynamically */}
                <p>{tabData?.data?.source?.transaction?.transaction_time
                    ? new Date(tabData?.data?.source.transaction.transaction_time).toLocaleString()
                    : "No data available"}
                </p>
              </div>

              
              <div className="mb-4 bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold border-b pb-2 mb-4" style={{ color: "#B02727" }}>
                  Email Details
                </h3>
                
                <p>
                  Subject: {tabData?.data?.source?.event_details?.subject || "No subject available"}
                </p>
               
                <p><span style={{ display: "flex", marginRight: "4px" }}>
                    <FileText size={16} style={{ marginRight: "4px" }} />
                    {tabData?.data?.source?.email_details?.Attachment || "No attachment available"}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      );


      case "extraction":
        return <ExtractionTab extractionData={tabData} />;
      case "validation":
          return <ValidateTab validationData={tabData} />;
      case "erp-data":
          return <ErpDataTab erpData={tabData} />;    
      case "validate-with-erp":
        return <ValidateWithERP validateWithErpData={tabData}/>;
      case "n-way-matching":
          return <NWayMatching nWayatchingData={tabData} />;  
        case "invoice-posted":
          return <InvoicePostedTab InvoicePosted={tabData} />; 
      case "Rejection Notification":
        return (

          <RejectionNotification isEditing={isEditing} setIsEditing={setIsEditing} />
        );
      default:
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {tabs.find((tab) => tab.key === tabKey).label}
            </h2>
            <p>
              Content for {tabs.find((tab) => tab.key === tabKey).label} goes
              here.
            </p>
          </div>
        );  
    }
  };

  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
    const selectedTab = tabs.find((tab) => tab.key === activeKey);
    setTabTitle(selectedTab.headerTitle);
  };

  //for pdf generate

  return (
    <div>
      <div className="flex justify-between">
        <span style={{ fontSize: "14px", fontWeight: "600" }}>Last Update: 25 Aug 2024, 02:51 PM</span>
        <Button className="mr-4" style={{ backgroundColor: "#0070AD", color: "white", fontSize: "12px" }}>Confidence Score</Button>
      </div>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Left side: PDF viewer */}
        <div className="w-full md:w-1/3 p-4 h-1/2 md:h-full">
          <div className="bg-white h-full rounded-lg shadow-lg p-2 overflow-auto">
           
            </div>
           
        </div>

        {/* Right side: Tabs and content */}
        <div className="w-full md:w-2/3 p-4 h-1/2 md:h-full overflow-y-auto">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            defaultActiveKey="invoice-received"
          >
            {tabs.map((tab) => (
              <TabPane
                key={tab.key}
                tab={
                  <span className="flex items-center">
                    <span className="mr-4 mt-4">{tab.label}</span>
                    {tab.icon}

                  </span>
                }
              >
                {renderTabContent(tab.key)}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TouchlessProcessDetailsPage;
