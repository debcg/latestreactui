import React from "react";
import { CheckCircle } from "lucide-react";

const ScoreIndicator = ({ score }) => {
  const color =
    score === 100
      ? "text-green-500"
      : score > 50
        ? "text-yellow-500"
        : "text-red-500";
  return <span className={`text-sm ${color}`}>Score: {score.toFixed(2)}</span>;
};

const DataRow = ({ label, score, invoice, po }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold">{label}</h4>
      <ScoreIndicator score={score} />
    </div>
    <p className="text-sm">Invoice: {invoice}</p>
    <p className="text-sm">PO: {po}</p>
  </div>
);

const ValidateWithERP = ({ validateWithErpData }) => {
  const { timestamp, data } = validateWithErpData;
  const { inv_po_gr_validation } = data || {};
  const { ValidationMatchingScores, ValidationMatchingGorulesResult } =
    inv_po_gr_validation || {};
  const { result, performance } = ValidationMatchingGorulesResult || {};
  const { fields = [], overallStatus, overallnextStep } = result || {};

  // Split the fields into two arrays: False status first, then True status
  const falseStatusFields = fields.filter((item) => item.status === "False");
  const trueStatusFields = fields.filter((item) => item.status === "True");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white p-4 rounded-lg shadow mb-4 w-full">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-semibold text-left"
              style={{ color: "#0070AD", fontSize: "16px" }}
            >
              Validate with ERP
            </h2>
          </div>
          <p className="text-gray-400 text-sm">{new Date(timestamp).toString()}</p>
          <p className="text-gray-400 text-sm">Performance: {performance}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(ValidationMatchingScores || {}).map(
            ([key, value], index) => {
              if (typeof value === "object" && value.Score !== undefined) {
                return (
                  <DataRow
                    key={index}
                    label={key}
                    score={value.Score}
                    invoice={value.Invoice_Value || "N/A"}
                    po={value.PO_Value || "N/A"}
                  />
                );
              }
              return null;
            }
          )}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Items</h3>
          <p className="text-sm text-gray-500">Performance: {performance}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left whitespace-nowrap">Sr. No.</th>
                <th className="p-2 text-left whitespace-nowrap">Field</th>
                <th className="p-2 text-left whitespace-nowrap">Message</th>
                <th className="p-2 text-left whitespace-nowrap">
                  Data Validation
                </th>
              </tr>
            </thead>
            <tbody>
              {/* First render all False status items */}
              {falseStatusFields.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 text-blue-600">{item.field}</td>
                  <td className="p-2">{item.message}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-[5px] ${item.status === "True" ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                    >
                      {item.status === "True" ? "True" : "False"}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Then render all True status items */}
              {trueStatusFields.map((item, index) => (
                <tr key={index + falseStatusFields.length} className="border-b">
                  <td className="p-2">{index + falseStatusFields.length + 1}</td>
                  <td className="p-2 text-blue-600">{item.field}</td>
                  <td className="p-2">{item.message}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-[5px] ${item.status === "True" ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                    >
                      {item.status === "True" ? "True" : "False"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ValidateWithERP;
