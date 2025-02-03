import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

const PDFProcessor = () => {
  const [text, setText] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Set up the worker source for PDF.js
  GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      const pdf = await getDocument(typedArray).promise;

      const page = await pdf.getPage(1); // Process the first page
      const textContent = await page.getTextContent(); // Extract text
      const extractedText = textContent.items
        .map((item) => item.str)
        .join(" ");
      setText(extractedText);
    };

    reader.readAsArrayBuffer(file);
  };

  const renderPdf = () => {
    if (!pdfUrl) return;
    const container = document.getElementById("pdfContainer");

    getDocument(pdfUrl).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
          canvasContext: context,
          viewport: viewport,
        });

        container.appendChild(canvas);
      });
    });
  };

  return (
    <div>
      <h1>PDF Processor</h1>
      <input type="file" onChange={handleFileUpload} accept=".pdf" />
      <div>
        <h2>Extracted Text:</h2>
        <p>{text}</p>
      </div>
      <div id="pdfContainer"></div>
    </div>
  );
};

export default PDFProcessor;
