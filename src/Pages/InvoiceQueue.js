import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Select, Button, Space, DatePicker, message, Spin, Upload } from "antd";
import { UploadOutlined, DownloadOutlined, CalendarOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const getStatusColor = (status) => {
  const colors = {
    "Approval Processed": "#00E096",
    "Under Process": "#12ABDB",
    "Extraction Validated": "#ECA336",
    "New Invoice": "#F1A4A4",
    "Moved to Manual Queue": "#FF6347",
    "Touchless Processed":"#00E096",
    "Rejected":"#fecaca99"
  };
  return colors[status] || "#d9d9d9";
};

const getSubjectColor = (subject) => {
  const colors = {
    "Invoice posted": "#B02727",
    "Invoice Data Extracted": "#34465F",
    "Extraction Validated": "#05A131",
    "New Invoice": "#0364B4",
  };
  return colors[subject] || "#000000";
};

const InvoiceQueue = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState(null);
  const fetchCalled = useRef(false); // To prevent double API call
  const navigate = useNavigate();

  function convertToDateFormat(isoString) {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
  const isoToDateTime = (isoString) => {
  try {
    // Convert ISO string to a Date object
    const date = new Date(isoString);
 
    // Extract date and time components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
 
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
 
    // Format as "DD-MM-YYYY HH:mm:ss"
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Error converting ISO to date-time:", error);
    return "Invalid ISO Date";
  }
};

  useEffect(() => {
    // Ensure fetch only happens once
    if (fetchCalled.current) return;
    fetchCalled.current = true; // Set ref to true after the first fetch

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://p2p-ui-invoice-handle.azurewebsites.net/api/get_invoices_table', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "transactionId": "GB4W96XABEY_20241113084053404474G0FQE.pdf",
          }),
        });
    
        if (response.ok) {
          const result = await response.json();
          // Remove the filtering and set all data directly
          setData(result || []);
          setFilteredData(result || []);
        } else {
          message.error("Failed to fetch data.");
        }
      } catch (error) {
        message.error("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesSearch = Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      const matchesSubject = selectedSubject === "" || item.subject === selectedSubject;
      const matchesStatus = selectedStatus === "" || item.status === selectedStatus;
      const matchesDateRange = !dateRange || (
        moment(item.invoiceDate).isBetween(dateRange[0], dateRange[1], "day", "[]")
      );
      return matchesSearch && matchesSubject && matchesStatus && matchesDateRange;
    });
    setFilteredData(filtered);
    setCurrent(1);
  }, [searchText, selectedSubject, selectedStatus, dateRange, data]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handlePaginationChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleDownload = () => {
    message.success("Data downloaded successfully.");
  };

  const paginatedData = filteredData.slice((current - 1) * pageSize, current * pageSize);

  const columns = [
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      sorter: true,
      render: (invoiceDate) => <span className="whitespace-nowrap">{convertToDateFormat(invoiceDate)}</span>,
    },
    {
      title: "Invoice ID",
      dataIndex: "invoiceId",
      sorter: true,
      render: (text) => <span style={{ color: "#605BFF", fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Purchase Order",
      dataIndex: "purchase_order",
      sorter: true,
    },
    {
      title: "Vendor",
      dataIndex: "vendor_name",
      sorter: true,
      render: (text) => (
        <div className="truncate max-w-[200px]" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: true,
      render: (subject) => (
        <span className="whitespace-nowrap" style={{ color: getSubjectColor(subject) }}>
          {subject}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      render: (status) => (
        <span
          className="px-2 py-1 rounded-[5px] text-white text-xs whitespace-nowrap"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Time Stamp",
      dataIndex: "timestamp",
      sorter: true,
      render: (timestamp) => <span className="whitespace-nowrap">{isoToDateTime(timestamp)}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleViewClick(record.invoiceId)}
          style={{ background: "#0070AD", fontWeight: 500 }}
        >
          <ArrowUpOutlined style={{ transform: "rotate(45deg)", fontSize: "16px" }} />
        </Button>
      ),
    },
  ];

  const handleViewClick = (invoiceId) => {
    navigate(`/invoice-queue/touchless-processed/${invoiceId}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2 font-bold">
          Last Updated: 25 Aug 2024, 02:51 PM
        </h1>
        <Space>
          <Upload
            name="file"
            action="/upload"
            onChange={handleUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} className="text-white" style={{ background: "#0070AD", fontWeight: 500 }}>
              Upload PDF
            </Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={handleDownload} className="text-white" style={{ background: "#0070AD", fontWeight: 500 }}>
            Download
          </Button>
          <div style={{ width: "270px", height: "40px" }} className="flex items-center bg-white rounded-lg px-2 py-2">
            <CalendarOutlined className="w-4 h-4 mr-2 text-blue-500" />
            <RangePicker
              className="custom-range-picker"
              allowClear={false}
              format="DD MMM YYYY"
              onChange={handleDateRangeChange}
            />
          </div>
        </Space>
      </div>

      <div className="flex mb-4">
        <Input
          placeholder="Search"
          value={searchText}
          onChange={handleSearch}
          className="w-48 mr-4"
        />
        <Select placeholder="Filter by Subject" className="w-48 mr-4" onChange={handleSubjectChange}>
          <Option value="">All</Option>
          <Option value="Invoice posted">Invoice posted</Option>
          <Option value="Invoice Data Extracted">Invoice Data Extracted</Option>
          <Option value="Extraction Validated">Extraction Validated</Option>
          <Option value="New Invoice">New Invoice</Option>
        </Select>
        <Select placeholder="Filter by Status" className="w-48" onChange={handleStatusChange}>
          <Option value="">All</Option>
          <Option value="Approval Processed">Approval Processed</Option>
          <Option value="Under Process">Under Process</Option>
          <Option value="Extraction Validated">Extraction Validated</Option>
          <Option value="New Invoice">New Invoice</Option>
        </Select>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={{
            current,
            pageSize,
            total: filteredData.length,
            onChange: handlePaginationChange,
            showSizeChanger: true,
          }}
          rowKey="invoiceId"
        />
      </Spin>
    </div>
  );
};

export default InvoiceQueue;
