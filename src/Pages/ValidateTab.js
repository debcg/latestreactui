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
        validationData?.data?.extraction_validation?.performance?.replace("ms", "")
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
        nextStep: field.next_step || "N/A", // Extract "next_step" or default to "N/A"
        rejection_reason: field.rejection_reason || "N/A", // Extract "rejection_reason" or default to "N/A"
        validation_type: field.validation_type || "N/A", // Extract "validation_type" or default to "N/A"
      }));

      // Sort data so that rows with status = false appear at the top
      const sortedData = formattedData.sort((a, b) => a.status - b.status);

      setTableData(sortedData);
    }
  }, [validationData]);

  // Table columns definition
  const columns = [
    {
      title: "S. No",
      render: (_, __, index) => index + 1, // Dynamically calculate the row number
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
      title: "Next Step",
      dataIndex: "nextStep",
      key: "nextStep",
    },
    {
      title: "Rejection Reason",
      dataIndex: "rejection_reason",
      key: "rejection_reason",
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
    {
      title: "Validation Type",
      dataIndex: "validation_type",
      key: "validation_type",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Title level={4}>Validation</Title>
      <p>
        Performance:{" "}
        {performance !== null ? `${performance.toFixed(6)}ms` : "Loading..."}
      </p>
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
