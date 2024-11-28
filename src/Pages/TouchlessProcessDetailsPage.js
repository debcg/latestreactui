import React, { useEffect, useState } from "react";
import { Tabs, Table, Card, Row, Col, Button, Input } from "antd";
import {
  FileText,
  CheckCircle,
  XCircle,
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
import { useLocation } from "react-router-dom";
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { TabPane } = Tabs;

const TouchlessProcessDetailsPage = () => {

  const location = useLocation();
  const { record } = location.state || {};
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { setTabTitle, clearTabTitle } = useHeaderStore();
  const [activeTab, setActiveTab] = useState("invoice-received");
  const [isEditing, setIsEditing] = useState(false);
  const [tabData, setTabData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    return () => {
      clearTabTitle();
    };
  }, [clearTabTitle]);
  //pdf api

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        const response = await axios.post(
          "https://p2p-ui-invoice-handle.azurewebsites.net/api/query_transaction",
          {
             transaction_id: record?.transaction_id,
            
          }
        );
        setTabData(response.data);
       
      } catch (error) {
        console.error("Error fetching tab data:", error);
      }
    };
  
    fetchTabData();
  }, []); // Fetch tab data only once
  


  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (!tabData) return; // Wait for tabData to load
  
      try {
        const pdfResponse = await axios.post(
          "https://p2p-ui-invoice-handle.azurewebsites.net/api/get_base64",
          {
            filename: tabData?.data?.source?.transaction?.id, // Ensure tabData is valid
            environment: "test",
          }
        );
        const base64String = pdfResponse.data.base64_string;
        const pdfBlob = base64ToBlob(base64String, "application/pdf");
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
     
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
      }
    };
  
    fetchPdfUrl();
  }, [tabData]); // Trigger fetching the PDF when tabData updates
  
  function base64ToBlob(base64, type = "application/pdf") {
    try {
      const binary = atob(base64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      return new Blob([array], { type });
    } catch (error) {
      console.error("Error converting base64 to Blob:", error);
      return null;
    }
  }


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // const validApiData = Array.isArray(tabData?.data) ? tabData?.data : [];
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
    // {
    //   key: "rejection-notification",
    //   label: "Rejection Notification",
    //   icon: <CheckCircle size={16} style={{ borderRadius: "1.8px solid #02823D", color: "#02823D" }} />,
    //   headerTitle: "Invoice Queue - Rejection Notification",
    // },
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
        return <ExtractionTab extractionData={tabData} recordData={record} />;
      case "validation":
        return <ValidateTab validationData={tabData} />;
      case "erp-data":
        return <ErpDataTab erpData={tabData} />;
      case "validate-with-erp":
        return <ValidateWithERP validateWithErpData={tabData} />;
      case "n-way-matching":
        return <NWayMatching nWayatchingData={tabData} />;
      case "invoice-posted":
        return <InvoicePostedTab InvoicePosted={tabData} />;
      // case "Rejection Notification":
      //   return (

      //     <RejectionNotification isEditing={isEditing} setIsEditing={setIsEditing} />
      //   );
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
  const checkTabDataForEnablement = () => {
    const enabledTabs = {
      "invoice-received": false,
      "extraction": false,
      "validation": false,
      "erp-data": false,
      "validate-with-erp": false,
      "n-way-matching": false,
      "rejection-notification": false,
      "invoice-posted": false,
    };

    if (tabData?.data?.source) {
      enabledTabs["invoice-received"] = true;
    }
    if (tabData?.data?.invoice) {
      enabledTabs["extraction"] = true;
    }
    if (tabData?.data?.extraction_validation) {
      enabledTabs["validation"] = true;
    }
    if (tabData?.data?.purchase_order) {
      enabledTabs["erp-data"] = true;
    }
    if (tabData?.data?.inv_po_gr_validation) {
      enabledTabs["validate-with-erp"] = true;
    }
    if (tabData?.data?.match_results) {
      enabledTabs["n-way-matching"] = true;
    }
    // if (tabData?.data?.rejection_notification) {
    //   enabledTabs["rejection-notification"] = true;
    // }
    if (tabData?.data?.invoice_posting_results) {
      enabledTabs["invoice-posted"] = true;
    }
    return enabledTabs;
  };
  
  const enabledTabs = checkTabDataForEnablement();
const currentTime = new Date().toLocaleTimeString();
  return (
    <div>
      <div className="flex justify-between">
        <span style={{ fontSize: "14px", fontWeight: "600" }}>Last Update: {currentTime}</span>
        <Button className="mr-4" style={{ backgroundColor: "#0070AD", color: "white", fontSize: "12px" }}>Confidence Score</Button>
      </div>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Left side: PDF viewer */}
        <div className="w-full md:w-1/3 p-4 h-1/2 md:h-full">
          <div className="bg-white h-full rounded-lg shadow-lg p-2 overflow-auto">
            {pdfUrl ? (
              <object
                title="pdf"
                data={`${pdfUrl}#view=FitH`}
                type="application/pdf"
                style={{
                  width: "100%", // Adjusts to the container's full width
                  height: "577px", // Adjusts to the container's full height
                }}
              >
                <p>Your browser doesn't support PDF viewing. Please download the PDF to view it.</p>
              </object>
            ) : (
              <div>Loading PDF...</div>
            )}
          </div>
        </div>

        {/* Right side: Tabs and content */}
        <div className="w-full md:w-2/3 p-4 h-1/2 md:h-full overflow-y-auto">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            defaultActiveKey="invoice-received"
          >
            {/* {tabs.map((tab) => (
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
            ))} */}

            {tabs.map((tab) => (
              <TabPane
                key={tab.key}
                disabled={!enabledTabs[tab.key]} // Disable tab based on the condition
                tab={
                  <span className="flex items-center">
                    <span className="pr-2">{tab.label}</span>
                    {/* Change the icon based on whether the tab is disabled or not */}
                    {enabledTabs[tab.key] ? (
                      <CheckCircle size={16} style={{ color: "#02823D", marginBottom:"12px" }} />
                    ) : (
                      <XCircle size={16} style={{ color: "#FF0000", marginBottom:"12px"}} />
                    )}
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
