import React from "react";
import { Card, Table, Typography } from "antd";

const { Text, Title } = Typography;

const NWayMatching = ({ nWayatchingData }) => {
  // Extracting data dynamically from the API response
  const matchResults = nWayatchingData?.data?.match_results?.two_way_result || {};
  const dataSource = Object.keys(matchResults).map((itemKey, index) => {
    const itemData = matchResults[itemKey];
    return {
      key: index + 1,
      item: index + 1,
      rows: [
        {
          type: "Invoice",
          description: itemData.Description?.Invoice_Value || "N/A",
          amount: itemData.Amount?.Invoice_Value || 0,
          quantity: itemData.Quantity?.Invoice_Value || 0,
          typeColor: "#0070ad",
        },
        {
          type: "PO",
          description: itemData.Description?.PO_Value || "N/A",
          amount: itemData.Amount?.PO_Value || 0,
          quantity: itemData.Quantity?.PO_Value || 0,
          typeColor: "green",
        },
      ],
    };
  });

  // Columns for the table
  const columns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      width: 80,
      render: (item) => <Text>{item}</Text>,
    },
    {
      title: "Type",
      dataIndex: "rows",
      key: "type",
      render: (_, record) =>
        record.rows.map((row, index) => (
          <div key={index}>
            <Text style={{ color: row.typeColor }}>{row.type}</Text>
          </div>
        )),
    },
    {
      title: "Description",
      dataIndex: "rows",
      key: "description",
      render: (_, record) =>
        record.rows.map((row, index) => (
          <div key={index}>
            <Text>{row.description}</Text>
          </div>
        )),
    },
    {
      title: "Amount",
      dataIndex: "rows",
      key: "amount",
      render: (_, record) =>
        record.rows.map((row, index) => (
          <div key={index}>
            <Text>{row.amount}</Text>
          </div>
        )),
    },
    {
      title: "Quantity",
      dataIndex: "rows",
      key: "quantity",
      render: (_, record) =>
        record.rows.map((row, index) => (
          <div key={index}>
            <Text>{row.quantity}</Text>
          </div>
        )),
    },
  ];

  return (
    <div>
      <Card className="mb-2">
        <h1 style={{ color: "#0070AD", fontSize: "16px", fontWeight: "600", }}>
          3 WAY MATCH
        </h1>
        <Text>Monday 28 October, 2024 at 12:46:09 pm</Text>
      </Card>
      <Card>
        <Text style={{ color: "#B02727", fontSize: "14px", marginBottom:"10px"  }}>
          3 Way Result
        </Text>
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
          rowClassName={(record, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
        />
      </Card>
    </div>
  );
};

export default NWayMatching;
