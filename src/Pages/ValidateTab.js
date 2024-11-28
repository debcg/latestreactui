import React, { useState, useEffect } from "react";
import { Table, Typography, Tag } from "antd";

const { Title } = Typography;

const ValidateTab = ({ validationData }) => {
  const [performance, setPerformance] = useState(null);
  const [tableData, setTableData] = useState([]);

  // Process the data when `validationData` is passed
  useEffect(() => {
    if (validationData) {
      // Extract performance value
      const extractedPerformance = parseFloat(
        validationData?.data?.extraction_validation?.performance
      );
      setPerformance(extractedPerformance);

      // Extract fields for the table
      const fields =
        validationData?.data?.extraction_validation?.result?.fields || [];
      const formattedData = fields.map((field, index) => ({
        key: index + 1, // Add key for AntD table
        field: field.field,
        message: field.message,
        status: field.status === "True", // Convert string to boolean
      }));

      setTableData(formattedData);
    }
  }, [validationData]);

  // Table columns definition
  const columns = [
    {
      title: "S. No",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Validation Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) =>
        status ? (
          <Tag color="#00E096" key="true">
            True
          </Tag>
        ) : (
          <Tag color="#F1A4A4" key="false">
            False
          </Tag>
        ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Title level={4}>Validation</Title>
      <p>Performance: {performance ? `${performance.toFixed(6)}ms` : "Loading..."}</p>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
        bordered
        className="mt-4"
      />
    </div>
  );
};

export default ValidateTab;
