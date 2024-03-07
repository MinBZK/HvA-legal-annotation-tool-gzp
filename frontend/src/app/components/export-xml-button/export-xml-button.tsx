// src/app/components/export/ExportXMLButton.tsx

import React from 'react';
import './export-xml-button.css';
import { BsDownload } from 'react-icons/bs';

type ExportXMLButtonProps = {
  xmlData: string; // De XML-data die geëxporteerd moet worden
  projectTitle: string;
};

const ExportXMLButton: React.FC<ExportXMLButtonProps> = ({ xmlData, projectTitle }) => {
  /**
   * Export the XML-data to a file by creating a temporary link and clicking it.
   */
  const handleExport = () => {
    // Convert the XML-data to a blob
    const blob = new Blob([xmlData], { type: 'text/xml' });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Format the current date
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Make a temporary link that can be clicked to download the file and click it
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle}_${currentDate}.xml`;
    document.body.appendChild(link);
    link.click();

    // Remove the link and revoke the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button className="exportButton" onClick={handleExport}>
      {' '}
      <BsDownload /> XML exporteren
    </button>
  );
};

export default ExportXMLButton;
