import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Input, notification, Card, Row, Col } from "antd";

import moment from "moment";
import axios from "axios";
const ExtractionTabEdit = ({ onClose, onSave, data, allData }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const labelMapping = JSON.parse(`{
  "InvoiceId":"invoice_id","InvoiceDate":"invoice_date","InvoiceTotal":"invoice_amount",
  "FreightCharges":"freight_amount","TotalTax":"tax_amount",
  "erp_name":"erp","PurchaseOrder":"purchase_order",
  "CustomerName":"bill_to_entity","BankAccountNumber":"bank_account",
  "CurrencyCode":"currency","IBAN": "iban",
  "VendorName":"vendor_name","VendorTaxId":"vendor_tax"
}`);

  // Extract fields with false status
  const fieldsWithFalseStatus = [
    ...(formData?.extraction_validation?.result?.fields || [])
      .filter((field) => field.status === "False")
      .map((field) => field.field),
    ...(formData?.inv_po_gr_validation?.ValidationMatchingGorulesResult?.result?.fields || [])
      .filter((field) => field.status === "False")
      .map((field) => field.field),
  ];

  // Highlight logic
  const getHighlightClass = (fieldName) =>
    fieldsWithFalseStatus.includes(labelMapping[fieldName]) ? "highlight-error" : "";

  // Initialize formData with the passed data prop
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // const handleInputChange = (key, value) => {
  //   const updatedData = { ...formData };
  //   const keys = key.split(".");
  //   let temp = updatedData;

  //   keys.forEach((k, index) => {
  //     if (index === keys.length - 1) {
  //       temp[k] = value;
  //     } else {
  //       temp = temp[k];
  //     }
  //   });

  //   setFormData(updatedData);
  // };

  const handleInputChange = (key, value) => {
    const updatedData = { ...formData };
    const keys = key.split(".");
    let temp = updatedData;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        temp[k] = value;
      } else {
        if (!temp[k]) {
          temp[k] = {}; // Initialize missing object
        }
        temp = temp[k];
      }
    });

    setFormData(updatedData);
  };

  const handleTableInputChange = (index, key, value) => {
    const updatedItems = [...(formData?.invoice?.Item || [])];
    if (!updatedItems[index]) return;

    if (!updatedItems[index][key]) {
      updatedItems[index][key] = {};
    }
    updatedItems[index][key].Value = value;

    setFormData({
      ...formData,
      invoice: {
        ...formData.invoice,
        Item: updatedItems,
      },
    });
  };

  const handleSave = async () => {

    try {
      const response = await axios.post(
        "https://apa-fa-test-reinsert.azurewebsites.net/api/reinsert",
        JSON.stringify(allData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Show success notification if the API call is successful
      notification.success({
        message: "Success!",
        description: "Data submitted successfully.",
        placement: "top",
      });

      if (onSave) {
        onSave(formData);
      }

      if (onClose) {
        onClose(); // Close the editable view
      }
    } catch (error) {
      // Handle errors
      notification.error({
        message: "Error!",
        description: "Failed to submit data. Please try again.",
        placement: "top",
      });
      console.error("API call failed: ", error);
    }
  };
  const items = formData?.invoice?.Item || [];
  const dataSource = items.map((item, index) => ({
    key: index,
    srNo: index + 1,
    itemCode: item?.ProductCode?.Value || "",
    description: item?.Description?.Value || "",
    qty: item?.Quantity?.Value || 0,
    currency: "AUD",
    unit: item?.Unit?.Value || "",
    unitPrice: item?.UnitPrice?.Value?.amount || 0,
    date: item?.Date?.Value || "",
    tax: item?.Tax?.Value?.amount || 0,
    amount: item?.Amount?.Value?.amount || 0,
  }));

  // Editable table columns
  const columns = [
    { title: "Sr. No.", dataIndex: "srNo", key: "srNo" },
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) =>
            handleTableInputChange(index, "Description", e.target.value)
          }
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleTableInputChange(index, "Qty", e.target.value)
          }
        />
      ),
    },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleTableInputChange(index, "Unit", e.target.value)}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleTableInputChange(index, "UnitPrice", e.target.value)
          }
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleTableInputChange(index, "Date", e.target.value)}
        />
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleTableInputChange(index, "Tax", e.target.value)}
        />
      ),
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];


  return (
    <div>
      <div className="mb-6" style={{
        // backgroundColor: "#ffffff", padding: "1rem",
        borderRadius: "8px",
        // marginTop: "1rem",
      }}>

        <div className="mb-2">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card bordered>
                <div className="mb-2">
                  <h3 className="mb-2" style={{ color: "#B02727" }}>Edit Invoice Details</h3>
                  <hr />
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("InvoiceId")}`}>
                          Invoice Id
                        </label>
                        <div>
                          <Input
                            type="text"
                            placeholder="Enter Invoice Id"
                            value={formData?.invoice?.InvoiceId?.Value || ""}
                            // value={
                            //   typeof formData?.invoice?.InvoiceId?.Value === "number"
                            //     ? formData?.invoice?.InvoiceId?.Value // Use number if it's a number
                            //     : formData?.invoice?.InvoiceId?.Value || "" // Use string or default to empty string
                            // }
                            onChange={(e) =>
                              handleInputChange("invoice.InvoiceId.Value", e.target.value)
                            }
                            className={getHighlightClass("InvoiceId")}
                          />
                          {/* {errors.invoiceId && <span className="error-asterisk">*</span>} */}
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("InvoiceDate")}`}>
                          Invoice Date
                        </label>
                        <DatePicker
                          value={
                            formData?.invoice?.InvoiceDate?.Value
                              ? moment(formData.invoice.InvoiceDate.Value, "YYYY-MM-DD").isValid()
                                ? moment(formData.invoice.InvoiceDate.Value, "YYYY-MM-DD") // Convert API date to moment object
                                : null
                              : null // Handle null or undefined gracefully
                          }
                          onChange={(date, dateString) => {
                            handleInputChange("invoice.InvoiceDate.Value", dateString || null); // Update state with selected date in string format
                          }}
                          format="YYYY-MM-DD" // Ensure format consistency
                          style={{ width: "100%" }}
                          className={getHighlightClass("InvoiceDate")}
                        />
                      </div>

                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("FreightCharges")}`}>
                          Freight Charges
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter Freight Charges"
                          value={formData?.Hilighted_fields?.freight_amount || ""}
                          onChange={(e) => handleInputChange("Hilighted_fields.freight_amount", e.target.value)}
                          className={getHighlightClass("FreightCharges")}
                        />
                      </div>


                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("InvoiceTotal")}`}>Invoice Total</label>
                        <Input
                          type="text"
                          placeholder="Enter Invoice Total"
                          value={formData?.invoice?.InvoiceTotal?.Value?.amount || ""}
                          onChange={(e) => handleInputChange("invoice.InvoiceTotal.Value.amount", e.target.value)}
                          className={getHighlightClass("InvoiceTotal")}
                        />
                      </div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("PurchaseOrder")}`}>Purchase Order</label>
                        <Input
                          type="text"
                          placeholder="Enter Purchase Order"
                          value={formData?.invoice?.PurchaseOrder?.Value || ""}
                          onChange={(e) =>
                            handleInputChange("invoice.PurchaseOrder.Value", e.target.value)
                          }
                          className={getHighlightClass("PurchaseOrder")}
                        />
                      </div>

                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("erp_name")}`}>Erp Name</label>
                        <Input
                          type="text"
                          placeholder="Enter Erp Name"
                          value={formData?.invoice?.erp_name || ""}
                          onChange={(e) =>
                            handleInputChange("invoice.erp_name", e.target.value)
                          }
                          className={getHighlightClass("erp_name")}
                        />
                      </div>


                    </div>
                  </Col>

                  
                </Row>
              </Card>
            </Col>

            <Col span={12}>
              <Card bordered>
                <div className="mb-2">
                  <h3 className="mb-2" style={{ color: "#B02727" }}> Edit Vendor & Customer Details</h3>
                  <hr />
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("VendorName")}`}>Vendor Name</label>
                        <Input
                          type="text"
                          placeholder="Enter Vendor Name"
                          value={formData?.invoice?.VendorName?.Value || ""}
                          onChange={(e) =>
                            handleInputChange("invoice.VendorName.Value", e.target.value)
                          }
                          className={getHighlightClass("VendorName")}
                        />
                      </div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("VendorTaxId")}`}>Vendor Tax Id</label>
                        <Input
                          type="text"
                          placeholder="Enter Vendor Tax Id"
                          value={formData?.invoice?.VendorTaxId?.Value || ""}
                          onChange={(e) =>
                            handleInputChange("invoice.VendorTaxId.Value", e.target.value)
                          }
                          className={getHighlightClass("VendorTaxId")}
                        />
                      </div>

                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("IBAN")}`}>IBAN</label>
                        <Input
                          type="text"
                          placeholder="Enter IBAN"
                          value={formData?.invoice?.IBAN?.Value || ""}
                          onChange={(e) => {
                            const updatedFormData = { ...formData };
                            if (!updatedFormData.invoice) updatedFormData.invoice = {};
                            if (!updatedFormData.invoice.IBAN) updatedFormData.invoice.IBAN = {};
                            updatedFormData.invoice.IBAN.Value = e.target.value;
                            setFormData(updatedFormData);
                          }}
                          className={getHighlightClass("IBAN")}
                        />
                      </div>


                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("CustomerName")}`}>Customer Name</label>
                        <Input
                          type="text"
                          placeholder="Enter Customer Name"
                          value={formData?.invoice?.CustomerName.Value || ""}
                          onChange={(e) =>
                            handleInputChange("invoice.CustomerName.Value", e.target.value)
                          }
                          className={getHighlightClass("CustomerName")}
                        />
                      </div>
                      <div className="mb-2">
                        <label className={`block font-semibold ${getHighlightClass("CustomerTaxId")}`}>Customer Tax Id</label>
                        <div>
                          <Input
                            type="text"
                            placeholder="Enter Customer Tax Id"
                            value={formData?.invoice?.CustomerTaxId?.Value || ""}
                            onChange={(e) =>
                              handleInputChange("invoice.CustomerTaxId.Value", e.target.value)
                            }
                            className={getHighlightClass("CustomerTaxId")}
                          />

                        </div>
                      </div>
                    </div>
                  </Col>

                 
                </Row>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="mb-2">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card bordered style={{ width: '100%' }}>
                <div className="mb-2">
                  <h3 className="mb-2" style={{ color: "#B02727" }}>Edit Financial Details</h3>
                  <hr />
                </div>
                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  <div className="ml-2 mr-4">
                    <label className={`block font-semibold ${getHighlightClass("BankAccountNumber")}`}>Bank Account Number</label>
                    <Input
                      type="number"
                      placeholder="Enter Bank Account Number"
                      value={formData?.invoice?.BankAccountNumber?.Value || ""}
                      onChange={(e) =>
                        handleInputChange("invoice.BankAccountNumber.Value", e.target.value)
                      }
                      className={getHighlightClass("BankAccountNumber")}
                    />
                  </div>

                  <div className="mr-4">
                    <label className={`block font-semibold ${getHighlightClass("CurrencyCode")}`}>Currency Code</label>
                    <Input
                      type="text"
                      placeholder="Enter Currency Code"
                      value={formData?.invoice?.CurrencyCode?.Value || ""}
                      onChange={(e) => handleInputChange("invoice.CurrencyCode.Value", e.target.value)}
                      className={getHighlightClass("CurrencyCode")}
                    />
                  </div>
                  <div className="mr-4">
                    <label className={`block font-semibold ${getHighlightClass("Discount")}`}>Discount</label>
                    <div className={`input-container ${errors.discount ? "input-error" : ""}`}>
                      <Input
                        type="text"
                        placeholder="Enter Discount"
                        value={formData.discount || ""}
                        onChange={(e) => handleInputChange("discount", e.target.value)}
                        className={getHighlightClass("Discount")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block font-semibold ${getHighlightClass("TotalTax")}`}>Total Tax</label>
                    <Input
                      type="text"
                      placeholder="Enter Total Tax"
                      value={formData?.invoice?.TotalTax?.Value?.amount || ""}
                      onChange={(e) => handleInputChange("invoice.TotalTax.Value.amount", e.target.value)}
                      className={getHighlightClass("TotalTax")}
                    />
                  </div>

                </Row>
              </Card>
            </Col>
          </Row>
        </div>

      </div>

      <div className="editTable-container" style={{
        // backgroundColor: "#ffffff", padding: "1rem",
        borderRadius: "8px",
        // marginTop: "1rem",
      }}>
        <Card>
          <h3 className="mb-2" style={{ color: "#B02727" }}>Items</h3>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>
        <div className="text-right">
          <Button type="primary" onClick={handleSave} style={{ marginTop: "15px", backgroundColor: "#0070AD" }}>
            Submit
          </Button>

        </div>

      </div>


    </div>
  );
};

export default ExtractionTabEdit;
