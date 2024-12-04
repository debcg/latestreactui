import React, { useState } from "react";
import { Button } from "antd";
import { FileText } from "lucide-react";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";

const RejectionNotification = ({ regData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  const {
    email_subject = "",
    attachment_name = "",
    rejection_email_body = "",
    recipient = "",
    transaction_id = "",
    sender="",
  } = regData || {};
  

  // Properly formatted rejection email body
  const initialMessage =
    rejection_email_body ||
    `Dear Supplier,

Please be informed that attached invoice has been received but we are not able to process it as PO number information is missing from the invoice copy. Please re-send the connected invoice copy to enable processing and payment.

Best Regards,
Service Desk`;

  const [message, setMessage] = useState(initialMessage);

  const handleEditChange = (e) => {
    setMessage(e.target.value);
  };

  

  const handleSendRejection = async () => {
    const apiUrl =
      "https://p2p-dev-fa-rejection-flow-frontend-handler3.azurewebsites.net/api/send_rejection_notification";

    const requestData = {
      "email_subject" :[email_subject],
      "recipient" : [recipient],
      "attachment_name" : attachment_name,
      "rejection_email_body" : message,
      "transaction_id" : transaction_id,
      "sender" : [sender] 
    };

    try {
      console.log("Sending Request:", requestData);
      const response = await axios.post(apiUrl, requestData);
      setApiResponse("Rejection notification sent successfully!");
      console.log("API Response:", response.data);
    } catch (error) {
      setApiResponse("Failed to send rejection notification.");
      console.error("API Error:", error.response?.data || error.message);
    }
  };
  const handleSubmit = () => {
    setSubmitted(true);
    setIsEditing(false);
    handleSendRejection()
  };
  return (
    <div>
      <div className="flex justify-between bg-white p-4 rounded-lg shadow mb-4">
        <div>
          <h2
            className="text-xl font-semibold pb-2"
            style={{ color: "#0070AD", fontSize: "14px" }}
          >
            REJECTION NOTIFICATION
          </h2>
          <p style={{ fontWeight: "500" }}>
            Friday 6 September, 2024 at 11:34:21 AM
          </p>
        </div>
      </div>
      <div className="mb-4 bg-white p-4 rounded-lg shadow">
        <h3
          className="font-semibold border-b pb-2 mb-4"
          style={{ color: "#B02727" }}
        >
          Email Details
        </h3>
        <p>
          <span className="font-semibold" style={{ fontWeight: "700" }}>
            Subject
          </span>
          : {email_subject}
        </p>
        <p className="mt-4">
          <span style={{ display: "flex", marginRight: "4px",lineHeight: "17px" }}>
            <FileText size={16} style={{ marginRight: "4px" }} />{" "}
            {attachment_name}
          </span>
        </p>
        <div className="mt-6 flex">
          <div style={{ marginRight: "310px" }}>
            <p className="font-semibold">Sender</p>
            <p>{sender}</p>
          </div>
          <div>
            <p className="font-semibold">Receiver</p>
            <p>{recipient}</p>
          </div>
        </div>
        <div className="flex justify-between border-b pb-2 mb-4">
          <div>
            <h2
              className="font-semibold"
              style={{ color: "#B02727", marginTop: "50px" }}
            >
              Rejection Summary
            </h2>
          </div>
          <div style={{ marginTop: "50px" }}>
            <span>
              <EditOutlined
                style={{ cursor: "pointer", color: "#0070AD" }}
                onClick={() => setIsEditing(!isEditing)} // Toggle edit mode
              />
            </span>
          </div>
        </div>
        <div>
          {isEditing ? (
            <textarea
              className="w-full my-4 p-2 border rounded no-scroll"
              style={{ fontWeight: "600", minHeight: "200px" }}
              value={message}
              onChange={handleEditChange}
            />
          ) : (
            message.split("\n").map((line, index) => (
              <p
                key={index}
                style={{
                  fontWeight: index === 0 ? "700" : "600",
                  margin: "4px 0",
                }}
              >
                {line}
              </p>
            ))
          )}
        </div>
        <div className="flex justify-between mt-12">
          {/* <div>
            <Button
              className="text-white"
              style={{ backgroundColor: "Gray" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div> */}
          <div>
            <Button
              className="text-white mr-2 reg-button"
              style={{ background: "#0070AD" }}
            >
              Move to Manual Queue
            </Button>
            <Button
              className="text-white reg-button"
              style={{ background: "#0070AD" }}
              onClick={handleSubmit}
             
            >
              Send Rejection
            </Button>
          </div>
        </div>
      </div>
      {submitted && (
        <div className="mt-4 text-green-600 font-semibold">
          Submission successful!
        </div>
      )}
      {apiResponse && (
        <div className={`mt-4 font-semibold ${apiResponse.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
          {apiResponse}
        </div>
      )}
    </div>
  );
};

export default RejectionNotification;
