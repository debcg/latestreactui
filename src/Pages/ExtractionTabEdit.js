import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Input, notification,Card } from "antd";
import moment from "moment";

const ExtractionTabEdit = ({ onClose, onSave, data }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize formData with the passed data prop
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (key, value) => {
    const updatedData = { ...formData };
    const keys = key.split(".");
    let temp = updatedData;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        temp[k] = value;
      } else {
        temp = temp[k];
      }
    });

    setFormData(updatedData);
  };

  const handleTableInputChange = (index, key, value) => {
    const updatedItems = [...(formData?.invoice?.Item || [])];
    if (!updatedItems[index]) return;

    updatedItems[index][key].Value = value;
    setFormData({
      ...formData,
      invoice: {
        ...formData.invoice,
        Item: updatedItems,
      },
    });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData?.invoice?.InvoiceId?.Value) newErrors.invoiceId = "Invoice ID is required.";
    
    if (!formData?.invoice?.CustomerTaxId?.Value) newErrors.customerTaxId = "Customer Tax ID is required.";
   
    if (!formData.discount) newErrors.discount = "Discount is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      if (onSave) {
        onSave(formData); // Pass updated data back to the parent
        notification.success({
          message: 'Success!',
          description: 'You have successfully saved the data.',
          placement: 'top',
        });
      }
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
            handleTableInputChange(index, "Quantity", e.target.value)
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
// given some condition for high light field

const fieldsWithExtractionFalseStatus = formData?.extraction_validation?.result?.fields
? formData?.extraction_validation.result.fields.filter(field => field.status === "False").map(field => field.field)
: [];

const fieldsWithFalseERPStatus = formData?.inv_po_gr_validation?.ValidationMatchingGorulesResult?.result?.fields
? formData?.inv_po_gr_validation.ValidationMatchingGorulesResult.result.fields
    .filter(field => field?.status === "False")
    .map(field => field?.field)
: [];
let hilightedFields = [...fieldsWithExtractionFalseStatus, ...fieldsWithFalseERPStatus];
   
    hilightedFields.push("InvoiceId");
    console.log("hilightedFields ===>: "+hilightedFields);
const lableMapping =`{
"InvoiceId":"invoice_id","InvoiceDate":"invoice_date","InvoiceTotal":"invoice_amount",
"FreightCharges":"freight_amount","TotalTax":"tax_amount",
"erp_name":"erp","PurchaseOrder":"purchase_order",
"CustomerName":"bill_to_entity","BankAccountNumber":"bank_account",
"CurrencyCode":"currency","IBAN": "iban",
"VendorName":"vendor_name","VendorTaxId":"vendor_tax"
}`;


//data
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div
            className="col-span-3 font-semibold border-b pb-2 mb-4"
            style={{ color: "#B02727" }}
          >
            Quick Edit
          </div>
         
          <div>
              
              <label className="block font-semibold">Invoice Id</label>
              <div className={`input-container ${errors.invoiceId ? "input-error" : ""}`}>
                <Input
                  type="number"
                  placeholder="Enter Invoice Id"
                  value={formData?.invoice?.InvoiceId?.Value || ""}
                  onChange={(e) =>
                    handleInputChange("invoice.InvoiceId.Value", e.target.value)
                  }
                 
                  className={`no-border ${errors.invoiceId ? "input-error" : ""}`}
                />
                {errors.invoiceId && <span className="error-asterisk">*</span>}
              </div>
              {errors.invoiceId && <span className="text-red-500">{errors.invoiceId}</span>}

            </div>

          <div>
            <label className="block font-semibold">Purchase Order</label>
            <Input
              type="number"
              placeholder="Enter Purchase Order"
              value={formData?.purchase_order?.OrderId || ""}
              onChange={(e) =>
                handleInputChange("purchase_order.OrderId", e.target.value)
              }
              className= "no-border"
            />
            {errors.purchaseOrder && (
              <span className="text-red-500">{errors.purchaseOrder}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold">Invoice Date</label>
            <DatePicker
              value={formData?.invoice?.InvoiceDate?.Value
                ? moment(formData?.invoice?.InvoiceDate?.Value, "DD/MM/YYYY")
                : null}
              onChange={(date, dateString) =>
                handleInputChange("invoice.InvoiceDate.Value", dateString)
              }
              style={{ width: "100%" }}
              className= "no-border"
            />
            {errors.invoiceDate && (
              <span className="text-red-500">{errors.invoiceDate}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold">Customer Tax Id</label>
            <div className={`input-container ${errors.CustomerTaxId ? "input-error" : ""}`}>
            <Input
              type="number"
              placeholder="Enter Customer Tax Id"
              value={formData?.invoice?.CustomerTaxId?.Value || ""}
              onChange={(e) =>
                handleInputChange("invoice.CustomerTaxId.Value", e.target.value)
              }
              
              className={`no-border ${errors.CustomerTaxId ? "input-error" : ""}`}
            />
            {errors.CustomerTaxId && <span className="error-asterisk">*</span>}
            </div>
            
            {errors.CustomerTaxId && <span className="text-red-500">{errors.CustomerTaxId}</span>}
          </div>

          <div>
            <label className="block font-semibold">Vendor Name</label>
            <Input
              type="text"
              placeholder="Enter Vendor Name"
              value={formData?.invoice?.VendorName?.Value || ""}
              onChange={(e) =>
                handleInputChange("invoice.VendorName.Value", e.target.value)
              }
              className= "no-border"
            />
            {errors.vendorName && (
              <span className="text-red-500">{errors.vendorName}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold">Vendor Tax Id</label>
            <Input
              type="number"
              placeholder="Enter Vendor Tax Id"
              value={formData?.invoice?.VendorTaxId?.Value || ""}
              onChange={(e) =>
                handleInputChange("invoice.VendorTaxId.Value", e.target.value)
              }
              className= "no-border"
            />
            {errors.vendorTaxId && (
              <span className="text-red-500">{errors.vendorTaxId}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold">Currency Code</label>
            <Input
              type="text"
              placeholder="Enter Currency Code"
              value={formData?.invoice?.CurrencyCode?.Value || ""}
              onChange={(e) => handleInputChange("invoice.CurrencyCode.Value", e.target.value)}
              className= "no-border"
            />
            {errors.currencyCode && (
              <span className="text-red-500">{errors.currencyCode}</span>
            )}
            
          </div>

          <div>
            <label className="block font-semibold">Discount</label>
            <div className={`input-container ${errors.discount ? "input-error" : ""}`}>
            <Input
              type="number"
              placeholder="Enter Discount"
              value={formData.discount || ""}
              onChange={(e) => handleInputChange("discount", e.target.value)}
              className={`no-border ${errors.discount ? "input-error" : ""}`}
              />
              {errors.discount && <span className="error-asterisk">*</span>}
            </div>
            {errors.discount && <span className="text-red-500">{errors.discount}</span>}
          </div>

          <div>
            <label className="block font-semibold">Invoice Total</label>
            <Input
              type="number"
              placeholder="Enter Invoice Total"
              value={formData?.invoice?.InvoiceTotal?.Value?.amount || ""}
              onChange={(e) => handleInputChange("invoice.InvoiceTotal.Value.amount", e.target.value)}
              className= "no-border"
            />
            {errors.invoiceTotal && (
              <span className="text-red-500">{errors.invoiceTotal}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold">Bank Account Number</label>
            <Input
              type="number"
              placeholder="Enter Bank Account Number"
              value={formData?.invoice?.BankAccountNumber?.Value || ""}
              onChange={(e) =>
                handleInputChange("invoice.BankAccountNumber.Value", e.target.value)
              }
              className= "no-border"
            />
            {errors.bankAccountNumber && (
              <span className="text-red-500">{errors.bankAccountNumber}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold">Total Tax</label>
            <Input
              type="number"
              placeholder="Enter Total Tax"
              value={formData?.invoice?.TotalTax?.Value?.amount || ""}
              onChange={(e) => handleInputChange("invoice.TotalTax.Value.amount", e.target.value)}
              className= "no-border"
            />
            {errors.totalTax && (
              <span className="text-red-500">{errors.totalTax}</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <Card>
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#B02727" }}>Items</h3>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>
      </div>

      <div className="text-right">
        <Button type="primary" onClick={handleSave} style={{marginTop:"15px", backgroundColor:"#0070AD" }}>
          Submit
        </Button>

      </div>
    </div>
  );
};

export default ExtractionTabEdit;
