import React, { useState, useEffect } from "react";
import { Tabs, Table, Card, Button } from 'antd';

const { TabPane } = Tabs;

const ErpDataTab = ({ erpData }) => {
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (erpData) {
      setSelectedData(erpData?.data || {});
    }
  }, [erpData]);

  const purchaseOrder = selectedData?.purchase_order || {};
  const vendor = selectedData?.vendor?.vendor || {};
  const goodsReceived = selectedData?.goods_received || {};

  const poDetails = purchaseOrder?.PODetail?.Lineitem?.lineitem || [];
  const grnItems = goodsReceived?.Items?.items?.['grn-lineitem'] || [];

  const poData = poDetails.map((item, index) => ({
    key: index.toString(),
    item: item.ItemNumber || "N/A",
    amount: `${item.Amount?.CurrencyCode || "N/A"} ${item.Amount?.Amount || 0}`,
    description: item.Description || "N/A",
    quantity: item.Quantity || 0,
    unitPrice: item.UnitPrice || 0,
    date: item.Date || "N/A",
    tax: `${item.Tax?.CurrencyCode || "N/A"} ${item.Tax?.Amount || 0}`,
  }));

  const grnData = grnItems.map((item, index) => ({
    key: index.toString(),
    item: item.ItemNumber || "N/A",
    amount: `${item.Currency || "N/A"} ${item.Amount || 0}`,
    description: item.Description || "N/A",
    quantity: item.Quantity || 0,
    unitPrice: "N/A",
    date: "N/A",
    tax: "N/A",
  }));

  const columns = [
    {
      title: 'Item No.',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      key: 'tax',
    },
  ];

  return (
    <div className="erp-container">
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<Button>PO</Button>} key="1">
            <div>
              <Card className="mb-2">
                <div className="mb-4">
                  <h3 className="mb-2" style={{ color: "#B02727" }}>Order ID: {purchaseOrder.OrderId || "N/A"}</h3>
                  <hr />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <strong>Sub Total</strong>
                    <p>Amount: {purchaseOrder?.PODetail?.SubTotal?.Amount || 0}</p>
                    <p>Currency Code: {purchaseOrder?.PODetail?.CurrencyCode || "N/A"}</p>
                  </div>
                  <div>
                    <strong>Total Tax</strong>
                    <p>Amount: {purchaseOrder?.PODetail?.TotalTax?.Amount || 0}</p>
                    <p>Currency Code: {purchaseOrder?.PODetail?.CurrencyCode || "N/A"}</p>
                  </div>
                  <div>
                    <strong>Grand Total</strong>
                    <p>Amount: {purchaseOrder?.PODetail?.GrandTotal?.Amount || 0}</p>
                    <p>Currency Code: {purchaseOrder?.PODetail?.CurrencyCode || "N/A"}</p>
                  </div>
                  
                </div>
              </Card>
              <Card>
                <h3 className="mb-2" style={{ color: "#B02727" }}>PO Details</h3>
                <Table dataSource={poData} columns={columns} pagination={false} />
              </Card>
            </div>
          </TabPane>
          <TabPane tab={<Button>GRN</Button>} key="2">
            <div>
              <div className="mb-4">
                <h3 className="mb-4" style={{ color: "#B02727" }}>Customer Name: {goodsReceived?.Vendor?.VendorName || "N/A"}</h3>
                <hr />
              </div>
              <Card className="mb-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <strong>Vendor ID</strong>
                    <p>{goodsReceived?.Vendor?.VendorId || "N/A"}</p>
                  </div>
                  <div>
                    <strong>Vendor Name</strong>
                    <p>{goodsReceived?.Vendor?.VendorName || "N/A"}</p>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p>{goodsReceived?.Vendor?.["E-mail"] || "N/A"}</p>
                  </div>
                  <div>
                    <strong>ABN</strong>
                    <p>{goodsReceived?.Vendor?.ABN || "N/A"}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className="mb-2" style={{ color: "#B02727" }}>GRN Details</h3>
                <Table dataSource={grnData} columns={columns} pagination={false} />
              </Card>
            </div>
          </TabPane>

          <TabPane tab={<Button>Vendor Master</Button>} key="3">
            <div>
              <Card className="mb-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <strong>Vendor ID</strong>
                    <p>{vendor.VendorId || "N/A"}</p>
                  </div>
                  <div>
                    <strong>Vendor Name</strong>
                    <p>{vendor.VendorName || "N/A"}</p>
                  </div>
                  <div>
                    <strong>Vendor Address</strong>
                    <p>{vendor?.VendorAddress?.StreetAddress || "N/A"}</p>
                    <p>{vendor?.VendorAddress?.City || "N/A"}</p>
                    <p>{vendor?.VendorAddress?.State || "N/A"}</p>
                    <p>{vendor?.VendorAddress?.PostalCode || "N/A"}</p>
                  </div>
                  <div>
                    <strong>Vendor Tax Id</strong>
                    <p>{vendor?.VendorTaxId || "N/A"}</p>
                   
                  </div>
                  
                </div>
              </Card>
              <Card className="mb-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  
                  <div>
                    <strong>Iban1</strong>
                    <p>{vendor?.Iban1 || "N/A"}</p>
                   
                  </div>
                  <div>
                    <strong>Iban3</strong>
                    <p>{vendor?.Iban3 || "N/A"}</p>
                   
                  </div>
                  <div>
                <h3 className="mb-2"><strong>Bank Details</strong></h3>
                <p>Bank Key: {vendor?.BankDetails?.BankKey || "N/A"}</p>
                <p>Bank Account: {vendor?.BankDetails?.BankAccount || "N/A"}</p>
                <p>AcctHolder: {vendor?.BankDetails?.AcctHolder || "N/A"}</p>
                <p>Currency: {vendor?.BankDetails?.Currency || "N/A"}</p>
                </div>
                <div>
                <h3 className="mb-2"><strong>Bank Details1</strong></h3>
                <p>Bank Key: {vendor?.BankDetails1?.BankKey || "N/A"}</p>
                <p>Bank Account: {vendor?.BankDetails1?.BankAccount || "N/A"}</p>
                <p>AcctHolder: {vendor?.BankDetails1?.AcctHolder || "N/A"}</p>
                <p>Currency: {vendor?.BankDetails1?.Currency || "N/A"}</p>
                </div>
                </div>
              </Card>
              <Card className="mb-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
               
                <div>
                <h3 className="mb-2"><strong>Bank Details2</strong></h3>
                <p>Bank Key: {vendor?.BankDetails2?.BankKey || "N/A"}</p>
                <p>Bank Account: {vendor?.BankDetails2?.BankAccount || "N/A"}</p>
                <p>AcctHolder: {vendor?.BankDetails2?.AcctHolder || "N/A"}</p>
                <p>Currency: {vendor?.BankDetails2?.Currency || "N/A"}</p>
                </div>
                <div>
                <h3 className="mb-2"><strong>Bank Details3</strong></h3>
                <p>Bank Key: {vendor?.BankDetails3?.BankKey || "N/A"}</p>
                <p>Bank Account: {vendor?.BankDetails3?.BankAccount || "N/A"}</p>
                <p>AcctHolder: {vendor?.BankDetails3?.AcctHolder || "N/A"}</p>
                <p>Currency: {vendor?.BankDetails3?.Currency || "N/A"}</p>
                </div>
                <div>
                <h3 className="mb-2"><strong>Bank Details4</strong></h3>
                <p>Bank Key: {vendor?.BankDetails4?.BankKey || "N/A"}</p>
                <p>Bank Account: {vendor?.BankDetails4?.BankAccount || "N/A"}</p>
                <p>AcctHolder: {vendor?.BankDetails4?.AcctHolder || "N/A"}</p>
                <p>Currency: {vendor?.BankDetails4?.Currency || "N/A"}</p>
                </div>
                </div>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ErpDataTab;
