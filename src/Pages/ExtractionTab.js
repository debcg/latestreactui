import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ExtractionTabEdit from "./ExtractionTabEdit";

const ExtractionTab = ({ extractionData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (extractionData) {
      setSelectedData(extractionData?.data || {});
    }
  }, [extractionData]);

  if (!selectedData) {
    return <div>Loading...</div>;
  }

  const invoice = selectedData?.invoice || {};

  // Accessing invoice and items data from the provided extractionData
  // const invoice = data?.invoice || {};
  const items = invoice?.Item || [];

  // Preparing table data source
  const dataSource = items.map((item, index) => ({
    key: index + 1,
    srNo: index + 1,
    itemCode: item?.ProductCode?.Value || "N/A",
    description: item?.Description?.Value || "N/A",
    qty: item?.Quantity?.Value || 0,
    currency: "AUD",
    unit: item?.Unit?.Value || "N/A",
    unitPrice: item?.UnitPrice?.Value?.amount || 0,
    date: item?.Date?.Value || "N/A",
    tax: item?.Tax?.Value?.amount || 0,
    amount: item?.Amount?.Value?.amount || 0,
  }));

  // Table columns
  const columns = [
    { title: "Sr. No.", dataIndex: "srNo", key: "srNo" },
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Tax", dataIndex: "tax", key: "tax" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];


  const formatAddress = (address) => {
    if (!address || typeof address !== "object") return "N/A";
    const { road, city, state, postal_code, country_region } = address;
    return [road, city, state, postal_code, country_region].filter(Boolean).join(", ");
  };

  // Address and Recipient Data
  const addressData = [
    {
      label: "Vendor Address",
      value: `${selectedData?.vendor?.vendor?.VendorAddress?.StreetAddress || ""}, 
        ${selectedData?.vendor?.vendor?.VendorAddress?.City || ""}, 
        ${selectedData?.vendor?.vendor?.VendorAddress?.State || ""}, 
        ${selectedData?.vendor?.vendor?.VendorAddress?.PostalCode || "N/A"}`,
    },
    {
      label: "Vendor Address Recipient",
      value: invoice?.VendorAddressRecipient?.Value || "N/A",
    },
    {
      label: "Billing Address",
      value: formatAddress(invoice?.BillingAddress?.Value),
    },
    {
      label: "Billing Address Recipient",
      value: invoice?.BillingAddressRecipient?.Value || "N/A",
    },
    {
      label: "Shipping Address",
      value: formatAddress(invoice?.ShippingAddress?.Value),
    },
    {
      label: "Shipping Address Recipient",
      value: invoice?.ShippingAddressRecipient?.Value || "N/A",
    },
  ];

  const handleSave = (updatedData) => {
    setSelectedData(updatedData);
    setIsEditing(false);
  };
  // const isEditable = selectedData?.status === "Moved to Manual Queue";
  return (
    <div className="rounded-lg">
      {/* Header Section */}
      <Card bordered shadow className="mb-2">
        <div
          className="flex justify-between"
          style={{
            position: "sticky",
            zIndex: 1,
            borderRadius: "8px",
          }}
        >
          <div>
            <h2 className="mb-2" style={{ color: "#0070AD", fontSize: "14px" }}>
              EXTRACTION
            </h2>
            <p>Monday 28 October, 2024 at 12:45:09 pm</p>
          </div>
          <div>
            {/* {isEditable && ( */}
              <EditOutlined
                style={{ cursor: "pointer", color: "#0070AD" }}
                onClick={() => setIsEditing(!isEditing)}
              />
            {/* )} */}
          </div>
        </div>
      </Card>

      {/* Edit Mode */}
      {isEditing ? (
        <ExtractionTabEdit data={selectedData} onSave={handleSave} onClose={() => setIsEditing(false)} />
      ) : (
        <>
          {/* Invoice and Vendor Details in One Row */}
          <div className="mb-2">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered>
                  <div className="mb-2">
                    <h3 className="mb-2" style={{ color: "#B02727" }}>Invoice Details</h3>
                    <hr />
                  </div>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div>
                        <div className="mb-4">
                          <strong>Invoice ID</strong>
                          <p>{invoice?.InvoiceId?.Value || "N/A"}</p>
                        </div>
                        <div>
                          <strong>Invoice Date</strong>
                          <p>{invoice?.InvoiceDate?.Value || "N/A"}</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <div className="mb-4">
                          <strong>Purchase Order</strong>
                          <p>{invoice?.PurchaseOrder?.Value || "N/A"}</p>
                        </div>
                        <div>
                          <strong>Due Date</strong>
                          <p>{invoice?.DueDate?.Value || "N/A"}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered>
                  <div className="mb-0">
                    <h3 className="mb-2" style={{ color: "#B02727" }}>Vendor & Customer Details</h3>
                    <hr />
                  </div>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div>
                        <div className="mb-2">
                          <strong>Vendor Name</strong>
                          <p>{invoice?.VendorName?.Value || "N/A"}</p>
                        </div>
                        <div>
                          <strong>Customer Name</strong>
                          <p>{invoice?.CustomerName?.Value || "N/A"}</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <div className="mb-2">
                          <strong>Vendor Tax ID</strong>
                          <p>{invoice?.VendorTaxId?.Value || "N/A"}</p>
                        </div>
                        <div>
                          <strong>Customer ID</strong>
                          <p>{invoice?.CustomerId?.Value || "N/A"}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Financial Details */}
          <div className="mb-2">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card bordered style={{ width: '100%' }}>
                  <div className="mb-2">
                    <h3 className="mb-2" style={{ color: "#B02727" }}>Financial Details</h3>
                    <hr />
                  </div>
                  <Row gutter={[16, 16]} style={{ width: '100%' }}>
                    {[
                      { label: "Bank Account Number", value: invoice?.BankAccountNumber?.Value || "N/A" },
                      { label: "Currency Code", value: invoice?.CurrencyCode?.Value || "AUD" },
                      { label: "Invoice Total", value: `$${invoice?.InvoiceTotal?.Value?.amount || 0}` },
                      { label: "Sub Total", value: `$${invoice?.SubTotal?.Value?.amount || 0}` },
                      { label: "Total Tax", value: `$${invoice?.TotalTax?.Value?.amount || 0}` },
                      { label: "Freight", value: `$${invoice?.Freight?.Value?.amount || 0}` }
                    ].map((item, index) => (
                      <Col span={4} key={index}> {/* Each item will take up 1/6th of the row */}
                        <div>
                          <h4 className="d flex justify-between font-semibold">{item.label}</h4>
                          <p>{item.value}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Address & Recipient Section */}

          <div className="mb-2">
            <Card bordered>
              <div className="mb-2">
                <h3 className="mb-2" style={{ color: "#B02727" }}>Addresses & Recipient</h3>
                <hr />
              </div>
              <Row gutter={[16, 16]}>
                {addressData.map((item, index) => (
                  <Col span={8} key={index}>
                    <h4 className="font-semibold">{item.label}</h4>
                    <p>{item.value}</p>
                  </Col>
                ))}
              </Row>
            </Card>
          </div>


          {/* Items Table */}
          <div className="p-2">
            <Card>
              <h3 className="mb-2" style={{ color: "#B02727" }}>Items</h3>
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{ x: true }}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ExtractionTab;
