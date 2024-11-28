
import React, { useState,useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  MoveRight,
  Download,
  Calendar,
} from "lucide-react";
import { DatePicker } from "antd";
import cn from "classnames";
import styles from "./DashboardPage.module.css";
const DashboardPage = () => {
// start

const [loading, setLoading] = useState(false);
  const [dasdata, setDasData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Helper function to get current time
  const getNowTime = () => new Date().toISOString();

  // Fetch function to hit the API
  const fetchInvoicesMetrics = async ({ startDate, endDate }) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        `https://p2p-ui-invoice-handle.azurewebsites.net/api/queueTable?dashboard=true&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setDasData(response.data); // Set fetched data in state
      setLastUpdated(getNowTime()); // Update the last updated time
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching is complete
    }
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    // Define date range (can be dynamic based on your logic)
    const dateRange = {
      start: "2023-01-01",
      end: "2023-12-31",
    };

    // Fetch data when the component mounts and check if data exists to prevent re-fetch
    if (!dasdata) {
      fetchInvoicesMetrics({
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
    }
    
  }, [dasdata]);



// end
  const { RangePicker } = DatePicker;
  const data = [
    { name: "Under Process", value: 500 },
    { name: "Moved to Manual Queue", value: 300 },
    { name: "Touchless Processed", value: 300 },
    { name: "Rejected", value: 200 },
  ];
  const COLORS = ["#00E096", "#F9CF4A", "#ECA336", "#E76262"];
  const invoicesSplitData = [
    { name: "PO", value: 70, color: "#12ABDB" },
    { name: "Non-PO", value: 30, color: "#F9CF4A" },
  ];

  const poInvoiceWaySplitData = [
    { name: "Two Way", value: 38, color: "#12ABDB" },
    { name: "Three Way", value: 32, color: "#00E096" },
  ];
  const CustomLabel = ({ x, y, value, width }) => (
    <g transform={`translate(${x + width + 10}, ${y - 10})`}>
      <rect
        x="0"
        y="0"
        width="35"
        height="24"
        rx="4"
        fill="white"
        stroke={value === 38 ? "#12ABDB" : "#00E096"}
        strokeWidth="1"
      />
      <text
        x="17.5"
        y="16"
        textAnchor="middle"
        fill="#666"
        fontSize="12"
        fontWeight="500"
      >
        {value}
      </text>
    </g>
  );

  const touchlessProcessingData = [
    { name: "Processed", value: 67 },
    { name: "Remaining", value: 33 },
  ];

  // const handleDateChange = (dates, dateStrings) => {
  //   console.log("Selected dates: ", dates);
  //   console.log("Formatted date strings: ", dateStrings);
  // };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${payload[0].name} Invoices`}</p>
          <p className="text-gray-600">
            <span className="font-semibold">{payload[0].value}%</span> of total
            invoices
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col gap-2 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{`${entry.value} (${data[index].value}%)`}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Last Updated: 25 Aug 2024, 02:51 PM
        </p>
        <div className="flex items-center">
        <button className="text-white px-4 py-2 rounded-lg flex items-center mr-4" style={{ backgroundColor: "#0070AD" }}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <div className="flex items-center">
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Total Invoices Received"
          value="121"
          icon={<FileText className="text-blue-500" />}
        />
        <StatCard
          title="Touchless Processed"
          value="75"
          icon={<CheckCircle className="text-green-500" />}
        />
        <StatCard
          title="Under Process"
          value="100"
          icon={<Clock className="text-yellow-500" />}
        />
        <StatCard
          title="Moved to Manual Queue"
          value="13"
          icon={<MoveRight className="text-purple-500" />}
        />
        <StatCard
          title="Rejected"
          value="27"
          icon={<XCircle className="text-red-500" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-center font-semibold mb-4">PO Invoices by Status</h3>
          <div className="relative" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} position={{ y: 50 }} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>

            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: "43.5%", top:"63%" }}
            >
              <p className="text-2xl font-bold">121</p>
              <div className="text-xs mt-24 text-center">
                Dated: 18.08.2024 - 25.08.2024
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Invoices by PO/Non-PO Split
          </h3>
          <div className="flex flex-col items-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoicesSplitData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    startAngle={0}
                    endAngle={360}
                  >
                    {invoicesSplitData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                    <Tooltip
                      content={<CustomTooltip />}
                      position={{ y: 0 }}
                      cursor={false}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-row gap-6 mt-4 justify-center">
              <div className="flex items-center">
                <div className="w-6 h-3 rounded-full bg-blue-600 mr-2" />
                <span className="text-sm text-gray-600">PO </span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-3 rounded-full bg-amber-400 mr-2" />
                <span className="text-sm text-gray-600">Non-PO</span>
              </div>
            </div>
          </div>
        </div> */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-center font-semibold mb-4">
            Invoices by PO/Non-PO Split
          </h3>
          <div className="flex flex-col items-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoicesSplitData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    startAngle={0}
                    endAngle={360}
                  >
                    {invoicesSplitData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    position={{ y: 0 }}
                    cursor={false}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-row gap-6 mt-4 justify-center">
              <div className="flex items-center">
              <div className="w-6 h-3 rounded-full mr-2" style={{ backgroundColor: '#12ABDB' }} />
                <span className="text-sm text-gray-600">PO </span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-3 rounded-full bg-amber-400 mr-2" />
                <span className="text-sm text-gray-600">Non-PO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-center font-semibold mb-4">
            PO Invoice by N - Way Split
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={poInvoiceWaySplitData}
                layout="vertical"
                margin={{ right: 50, left: 20, top: 20, bottom: 20 }}
                barGap={60}
              >
                <XAxis type="number" hide={true} />
                <YAxis type="category" hide={true} />
                {poInvoiceWaySplitData.map((entry, index) => (
                  <Bar
                    key={entry.name}
                    dataKey="value"
                    data={[{ ...entry, y: entry.y }]}
                    fill={entry.color}
                    barSize={8}
                    radius={4}
                    label={<CustomLabel />}
                    y={entry.y}
                    style={{ marginBottom: 50 }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#0088FE] mr-2" />
              <span className="text-sm text-gray-600">Two Way</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />{" "}
            {/* Vertical separator line */}
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#00C49F] mr-2" />
              <span className="text-sm text-gray-600">Three Way</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-center font-semibold mb-4">
            Touchless PO Invoice Processing %
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={touchlessProcessingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#12ABDB" />
                <Cell fill="#F9CF4A" />
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold"
              >
                67%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Pending Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-100 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Non - PO Invoice</h4>
              <p className="text-3xl font-bold">76</p>
              <p className="text-sm">Invoice Pending Approval</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">3 - Way Match</h4>
              <p className="text-3xl font-bold">300</p>
              <p className="text-sm">Invoice Pending GR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-4 ">
    <div className="flex items-center mb-2">
      <div className="p-2 bg-blue-50 rounded-lg">
        {icon || <FileText className="w-6 h-6 text-blue-500" />}
      </div>
      <div className="ml-auto">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-gray-500 text-sm">{title}</p>
      <span className="text-blue-500 text-lg">→</span>
    </div>
  </div>
);

export default DashboardPage;
