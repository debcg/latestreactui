// // // src/PdfViewer.js
// // import React, { useState } from "react";
// // import { Document, Page, pdfjs } from "react-pdf";

// // // Set the workerSrc to the local path of the worker file
// // pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf/pdf.worker.min.js`;

// // const PdfViewer = ({ pdfFile }) => {
// //   const [numPages, setNumPages] = useState(null);
// //   const [pageNumber, setPageNumber] = useState(1);

// //   const onDocumentLoadSuccess = ({ numPages }) => {
// //     setNumPages(numPages);
// //   };

// //   return (
// //     <div>
// //       <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
// //         <Page pageNumber={pageNumber} />
// //       </Document>
// //       <div>
// //         <p>
// //           Page {pageNumber} of {numPages}
// //         </p>
// //         <button
// //           disabled={pageNumber <= 1}
// //           onClick={() => setPageNumber(pageNumber - 1)}
// //         >
// //           Previous
// //         </button>
// //         <button
// //           disabled={pageNumber >= numPages}
// //           onClick={() => setPageNumber(pageNumber + 1)}
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PdfViewer;
// // src/PdfViewer.js
// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// // Set the workerSrc to the local path of the worker file from the pdfjs-dist package
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;

// // If you want to use the worker file from local installation
// // pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf/pdf.worker.min.js`;

// const PdfViewer = ({ pdfFile }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div>
//       <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <div>
//         <p>
//           Page {pageNumber} of {numPages}
//         </p>
//         <button
//           disabled={pageNumber <= 1}
//           onClick={() => setPageNumber(pageNumber - 1)}
//         >
//           Previous
//         </button>
//         <button
//           disabled={pageNumber >= numPages}
//           onClick={() => setPageNumber(pageNumber + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PdfViewer;
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the workerSrc to the local file
pdfjs.GlobalWorkerOptions.workerSrc = `pdfjs-dist/build/pdf.worker.min.js`;

const PdfViewer = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className="border rounded-lg shadow-lg overflow-hidden"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div className="flex justify-between mt-4 w-full">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
