import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2 } from 'react-icons/fi'; 
import './static/index.css';


export default function Home() {
  // Mock data for the list of documents
  const documents = [
    { id: 1, title: 'XML annotate example title' },
    { id: 2, title: 'XML annotate example title' },
    { id: 3, title: 'XML annotate example title' },
    { id: 4, title: 'XML annotate example title' },
  ];

  return (
    <div className="container">
      <header className="header">
        <h1>Legal Annotation Tool</h1>
        <button className="import-button">Importeer XML</button>
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
              <FiTrash2 className="delete-icon" />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
