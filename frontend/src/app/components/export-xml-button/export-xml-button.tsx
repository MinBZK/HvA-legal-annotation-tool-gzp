// src/app/components/export/ExportXMLButton.tsx

import React from 'react';
import './export-xml-button.css';
import {BsDownload} from "react-icons/bs";

type ExportXMLButtonProps = {
    xmlData: string; // De XML-data die geëxporteerd moet worden
};

const ExportXMLButton: React.FC<ExportXMLButtonProps> = ({ xmlData }) => {
    const handleExport = () => {
        // Maak een blob van de XML-data
        const blob = new Blob([xmlData], { type: 'text/xml' });

        // Maak een URL voor de blob
        const url = URL.createObjectURL(blob);

        // Maak een tijdelijke link om de download te starten
        const link = document.createElement('a');
        link.href = url;
        link.download = 'exported_file.xml';
        document.body.appendChild(link);
        link.click();

        // Verwijder de link en geef de URL vrij
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return <button className="exportButton" onClick={handleExport}> <BsDownload/> Export XML</button>;
};

export default ExportXMLButton;
