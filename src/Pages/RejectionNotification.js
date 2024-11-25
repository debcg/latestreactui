import React, { useState } from "react";
import { Button } from "antd";
import { FileText } from "lucide-react";
import { EditOutlined } from "@ant-design/icons";

const RejectionNotification = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const initialMessage = `Dear Duplier,\n\nPlease be informed that attached invoice 779120234577 has been received but we are not able to process it as PO number information is missing from the invoice copy. Please re-send the connected invoice copy to enable processing and payment.\n\nBest Regards,\nService Desk`;
  
  const [message, setMessage] = useState(initialMessage);

  const handleEditChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between bg-white p-4 rounded-lg shadow mb-4">
        <div>
          <h2 className="text-xl font-semibold pb-2" style={{ color: "#0070AD", fontSize: "14px" }}>REJECTION NOTIFICATION</h2>
        </div>
        <div>
          <p style={{ fontWeight: "500" }}>Friday 6 September, 2024 at 11:34:21 AM</p>
          <p className="text-green-600 text-sm" style={{ color: "#B02727" }}>
            Status: Moved to Manual Queue
          </p>
        </div>
      </div>
      <div className="mb-4 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold border-b pb-2 mb-4" style={{ color: "#B02727" }}>Email Details</h3>
        <p><span className="font-semibold" style={{ fontWeight: "700" }}>Subject</span>: PO NOT QUOTED</p>
        <p className="mt-4"><span style={{ display: "flex", marginRight: "4px" }}><FileText size={16} style={{ marginRight: "4px" }} /> SAPA-S39237537_edited(1)_20240606053619538069axe0.pdf</span></p>
        <div className="mt-6 flex">
          <div style={{ marginRight: "310px" }}>
            <p className="font-semibold">Sender</p>
            <p>TEL</p>
          </div>
          <div>
            <p className="font-semibold">Receiver</p>
            <p>TEL Electrical</p>
          </div>
        </div>
        <div className="flex justify-between border-b pb-2 mb-4">
          <div>
            <h2 className="font-semibold" style={{ color: "#B02727", marginTop: "50px" }}>Rejection Summary</h2>
          </div>
          <div style={{ marginTop: "50px" }}>
            <span>
              <EditOutlined
                style={{ cursor: 'pointer', color: '#0070AD' }}
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
              <p key={index} style={{ fontWeight: index === 0 ? "700" : "600", margin: "4px 0" }}>{line}</p>
            ))
          )}
        </div>
        <div className="flex justify-between mt-12">
          <div>
            <Button className="text-white" style={{ backgroundColor: "Gray" }} onClick={handleSubmit}>Submit</Button>
          </div>
          <div>
            <Button className="text-white mr-2" style={{ background: "#0070AD" }}>Move to Manual Queue</Button>
            <Button className="text-white" style={{ background: "#0070AD" }}>Send Rejection</Button>
          </div>
        </div>
      </div>
      {submitted && (
        <div className="mt-4 text-green-600 font-semibold">
          Submission successful!
        </div>
      )}
    </div>
  );
};

export default RejectionNotification;
