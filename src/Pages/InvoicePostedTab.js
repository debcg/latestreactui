import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col } from "antd";


const InvoicePostedTab = ({ InvoicePosted }) => {
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        if (InvoicePosted) {
            setSelectedData(InvoicePosted?.data || {});
        }
    }, [InvoicePosted]);

    if (!selectedData) {
        return <div>Loading...</div>;
    }
    const invoice = selectedData?.invoice || {};
    return (
        <div>
            {/* Header Section */}
            <div
                className="mb-2"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 99999,
                    borderRadius: "8px",
                }}
            >
                <Card bordered style={{ width: "100%" }}>
                    <div>
                        <h2 className="mb-2" style={{ color: "#0070AD", fontSize: "16px", fontWeight: "600" }}>
                            INVOICE POSTED
                        </h2>
                        <p style={{ fontSize: "12px" }}>Monday 28 October, 2024 at 12:45:09 pm</p>
                    </div>
                </Card>
            </div>


            <>
                {/* Invoice and Vendor Details in One Row */}
                <div className="mb-2">
                    <Row gutter={[8, 8]}>
                        <Col span={8}>
                            <Card bordered style={{ width: "100%" }}>
                                <div className="mb-2">
                                    <h3 className="mb-2" style={{ color: "#B02727", fontSize: "14px" }}>Invoice Details</h3>
                                    <hr />
                                </div>
                                <Row gutter={[8, 8]}>
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
                        <Col span={16}>
                            <Card bordered>
                                <div className="mb-2">
                                    <h3 className="mb-2" style={{ color: "#B02727", fontSize: "14px" }}>Vendor & Customer Details</h3>
                                    <hr />
                                </div>
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <div>
                                            <strong>Vendor Name</strong>
                                            <p>{invoice?.VendorName?.Value || "N/A"}</p>
                                        </div>

                                        <div>
                                            <strong>Customer Name</strong>
                                            <p>{invoice?.CustomerName?.Value || "N/A"}</p>
                                        </div>


                                    </Col>
                                    <Col span={8}>

                                        <div>
                                            <strong>Vendor Country</strong>
                                            <p>{invoice?.VendorCountry?.Value || "N/A"}</p>
                                        </div>

                                        <div>
                                            <strong>Customer Country</strong>
                                            <p>{invoice?.CustomerCountry?.Value || "N/A"}</p>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <strong>Vendor Number</strong>
                                            <p>{invoice?.VendorNumber?.Value || "N/A"}</p>
                                        </div>
                                        <div>
                                            <strong>Customer Tax Id</strong>
                                            <p>{invoice?.CustomerTaxId?.Value || "N/A"}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Financial Details */}
                <div>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card bordered style={{ width: '100%' }}>
                                <div className="mb-4">
                                    <h3 className="mb-2"  style={{ color: "#B02727", fontSize: "14px" }}>Financial Details</h3>
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




            </>

        </div>
    );
};

export default InvoicePostedTab;
