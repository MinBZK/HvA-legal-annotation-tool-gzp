'use client'

import Link from 'next/link';
import {FiTrash2} from 'react-icons/fi';
import './static/index.css';
import {useRef} from 'react';


export default function Home() {
    // Mock data for the list of documents
    const documents = [
        {id: 1, title: 'XML annotate example title'},
        {id: 2, title: 'XML annotate example title'},
        {id: 3, title: 'XML annotate example title'},
        {id: 4, title: 'XML annotate example title'},
    ];

    const hiddenInput = useRef(null);

    const handleClick = () => {
        // @ts-ignore
        hiddenInput.current.click();
    };

    const importToLocal = (event:any) => {
        const file = event.target.files[0];

        // Perform actions with the selected file (e.g., store in the root directory)
        // Note: Access to the file system in the browser is restricted for security reasons.
        // You might need to upload the file to a server or use browser storage.
    };


    return (
        <div className="container">
            <header className="header">
                <h1>Legal Annotation Tool</h1>
                <input
                    type="file"
                    accept=".xml"
                    ref={hiddenInput}
                    onChange={importToLocal}
                    style={{display: 'none'}}
                />
                <button onClick={handleClick} className="import-button">Importeer XML</button>
            </header>
            <main className="main-content">
                <h2>Documenten</h2>
                <ul className="document-list">
                    {documents.map((doc) => (
                        <li key={doc.id} className="document-item">
                            <span className="document-title">{doc.title}</span>
                            <Link href={`/documents/${doc.id}`} passHref>
                                <button className="open-button">Open document</button>
                            </Link>
                            <FiTrash2 className="delete-icon"/>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
