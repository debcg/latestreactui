
import React, { useEffect, useState } from "react";
import { Table, Input, Select, DatePicker, Button, Space } from "antd";
import {
  Upload,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import cn from "classnames";
import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;
const { Option } = Select;

const getStatusColor = (status) => {
  const colors = {
    "Approval Processed": "#52c41a",
    "Under Process": "#1890ff",
    "Extraction Validated": "#faad14",
    "New Invoice": "#f5222d",
  };
  return colors[status] || "#d9d9d9";
};

const getSubjectColor = (subject) => {
  const colors = {
    "Invoice posted": "#f5222d",
    "Invoice Data Extracted": "#1890ff",
    "Extraction Validated": "#faad14",
    "New Invoice": "#52c41a",
  };
  return colors[subject] || "#000000";
};

const data = [
  {
    key: "1",
    invoiceDate: "03/01/2020",
    invoiceId: "IN-24-90168",
    purchaseOrder: "AD24-05467",
    vendor: "McGrath Tech Industries Pty Ltd",
    subject: "Invoice posted",
    status: "Approval Processed",
    timeStamp: "6 Sep 2024 at 9:47 am",
  },
  {
    key: "2",
    invoiceDate: "03/01/2020",
    invoiceId: "A000039445697",
    purchaseOrder: "AD24-05467",
    vendor: "中国电信股份有限公司北京分公司",
    subject: "Invoice Data Extracted",
    status: "Under Process",
    timeStamp: "6 Sep 2024 at 9:47 am",
  },
  {
    key: "3",
    invoiceDate: "03/01/2020",
    invoiceId: "344891-123",
    purchaseOrder: "344891-123",
    vendor: "TLE",
    subject: "Extraction Validated",
    status: "Extraction Validated",
    timeStamp: "6 Sep 2024 at 9:47 am",
  },
  {
    key: "4",
    invoiceDate: "03/01/2020",
    invoiceId: "A000039445697",
    purchaseOrder: "AD24-05467",
    vendor: "中国电信股份有限公司北京分公司",
    subject: "New Invoice",
    status: "New Invoice",
    timeStamp: "6 Sep 2024 at 9:47 am",
  },
];

const CustomPagination = ({ total, current, onChange, pageSize }) => (
  <div className="flex items-center justify-between mt-4">
    <div className="flex items-center">
      <Select
        value={pageSize}
        onChange={(value) => onChange(current, value)}
        className="w-24 mr-4"
      >
        <Option value={10}>10</Option>
        <Option value={25}>25</Option>
        <Option value={50}>50</Option>
        <Option value={100}>100</Option>
      </Select>
      <span className="text-sm text-gray-500">items per page</span>
    </div>
    <div className="flex items-center">
      <span className="text-sm text-gray-500 mr-4">
        Page {current} of {Math.ceil(total / pageSize)}
      </span>
      <Button
        icon={<ChevronLeft size={16} />}
        disabled={current === 1}
        onClick={() => onChange(current - 1, pageSize)}
        className="mr-2"
      />
      <Button
        icon={<ChevronRight size={16} />}
        disabled={current === Math.ceil(total / pageSize)}
        onClick={() => onChange(current + 1, pageSize)}
      />
    </div>
  </div>
);

const MatchDefinitionsPage = () => {
  const columns = [
    {
      title: <span className="whitespace-nowrap">Invoice Date</span>,
      dataIndex: "invoiceDate",
      sorter: true,
    },
    {
      title: <span className="whitespace-nowrap">Invoice ID</span>,
      dataIndex: "invoiceId",
      sorter: true,
      render: (text) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: <span className="whitespace-nowrap">Purchase Order</span>,
      dataIndex: "purchaseOrder",
      sorter: true,
    },
    {
      title: <span className="whitespace-nowrap">Vendor</span>,
      dataIndex: "vendor",
      sorter: true,
      render: (text) => (
        <div className="truncate max-w-[200px]" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: <span className="whitespace-nowrap">Subject</span>,
      dataIndex: "subject",
      sorter: true,
      render: (subject) => (
        <span
          className="whitespace-nowrap"
          style={{ color: getSubjectColor(subject) }}
        >
          {subject}
        </span>
      ),
    },
    {
      title: <span className="whitespace-nowrap">Status</span>,
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
      title: <span className="whitespace-nowrap">Time Stamp</span>,
      dataIndex: "timeStamp",
      sorter: true,
      render: (timeStamp) => (
        <span className="whitespace-nowrap">{timeStamp}</span>
      ),
    },
    {
      title: <span className="whitespace-nowrap">Action</span>,
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          className="bg-blue-500"
          onClick={() => handleViewClick(record.key)}
        >
          View
        </Button>
      ),
    },
  ];
  const [searchText, setSearchText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const handleViewClick = (rowId) => {
    navigate(`/invoice-queue/touchless-processed/${rowId}`);
  };
  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (val) =>
          val.toString().toLowerCase().includes(searchText.toLowerCase()) &&
          (selectedSubject === "" || item.subject === selectedSubject) &&
          (selectedStatus === "" || item.status === selectedStatus)
      )
    );
    setFilteredData(filtered);
    setCurrent(1); // Reset to first page when filters change
  }, [searchText, selectedSubject, selectedStatus]);

  const handleSearch = (value) => {
    setSearchText(value);
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

  const paginatedData = filteredData.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2 font-bold">
          Last Updated: 25 Aug 2024, 02:51 PM
        </h1>
        <Space>
          <Button
            icon={<Upload size={16} />}
            className="bg-blue-500 text-white"
          >
            Upload PDF
          </Button>
          <Button
            icon={<Download size={16} />}
            className="bg-blue-500 text-white"
          >
            Download
          </Button>
          <div
            style={{ width: "270px", height: "40px" }}
            className="flex items-center bg-white rounded-lg px-2 py-2"
          >
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <RangePicker
              className={cn(styles["custom-range-picker"])}
              allowClear={false}
              format="DD MMM YYYY"
            />
          </div>
        </Space>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Space>
          <Input
            placeholder="Search..."
            prefix={<Search size={16} />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-48"
          />
          <Select
            placeholder="Filter by Subject"
            className="w-48"
            onChange={handleSubjectChange}
          >
            <Option value="">All</Option>
            <Option value="Invoice posted">Invoice posted</Option>
            <Option value="Invoice Data Extracted">
              Invoice Data Extracted
            </Option>
            <Option value="Extraction Validated">Extraction Validated</Option>
            <Option value="New Invoice">New Invoice</Option>
          </Select>
          <Select
            placeholder="Filter by Status"
            className="w-48"
            onChange={handleStatusChange}
          >
            <Option value="">All</Option>
            <Option value="Approval Processed">Approval Processed</Option>
            <Option value="Under Process">Under Process</Option>
            <Option value="Extraction Validated">Extraction Validated</Option>
            <Option value="New Invoice">New Invoice</Option>
          </Select>
        </Space>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          className="mb-4"
          scroll={{ x: true }}
        />
      </div>
      <CustomPagination
        total={filteredData.length}
        current={current}
        onChange={handlePaginationChange}
        pageSize={pageSize}
      />
    </div>
  );
};

export default MatchDefinitionsPage;
