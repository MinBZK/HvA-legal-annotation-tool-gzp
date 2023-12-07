'use client'
import Link from 'next/link';
import { FiTrash2 } from 'react-icons/fi';
import './static/index.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { uploadXML } from './services/project'
import { BsDownload } from "react-icons/bs";

export default function Home() {

  // Mock data for the list of documents
  const documents = [
    { id: 1, title: 'XML annotate example title' },
    { id: 2, title: 'XML annotate example title' },
    { id: 3, title: 'XML annotate example title' },
    { id: 4, title: 'XML annotate example title' },
  ];

  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fileInputRef = useRef(null);

  // Handle XML Upload
  const handleXmlUpload = async () => {
    if (fileInputRef.current != null) {
      const reader = new FileReader();
      reader.readAsText(fileInputRef.current["files"][0]);
      reader.onload = async (event) => {
        if (event.target != null && typeof event.target.result === "string") {
          const response = await uploadXML(event.target.result);

          if (response.status == 201) {
            setShow(false)
          } else {
            setShowError(true)
          }
        }
      }
    };
  };

  return (
      <>
          <div>
              <nav className="navbar">
                  {<div className="navbar-title">Legal Annotation Tool</div>}
              </nav>
          </div>
          <div className="container">
              <main className="main-content">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="doc-text">Documenten</h2>
                      <button
                          className="import-button"
                          // type="button"
                          onClick={handleShow}
                      >
                          <BsDownload className="download-icon" size={20}/>
                          Importeer XML
                      </button>
                  </div>
                  <ul className="document-list">
                      {documents.map((doc) => (
                          <li key={doc.id} className="document-item">
                              <div className="document-info">
                                  <span className="document-title">{doc.title}</span>
                              </div>
                              <div className="actions">
                                  <Link href={`/documents/${doc.id}`} passHref>
                                      <button className="open-button">Open document</button>
                                  </Link>
                                  <FiTrash2 className="delete-icon" />
                              </div>
                          </li>
                      ))}
                  </ul>
              </main>

              <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                      <Modal.Title>Upload bestand</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Alert show={showError} variant="danger" dismissible>
                          <Alert.Heading>Error</Alert.Heading>
                          <p>
                              Something went wrong
                          </p>
                      </Alert>
                      <Form action={handleXmlUpload}>
                          <input
                              type="file"
                              accept="text/xml"
                              ref={fileInputRef}/>
                          <Button type='submit' className='success float-end mt-3'>
                              Upload
                          </Button>
                      </Form>
                  </Modal.Body>
              </Modal>
          </div>
      </>
  );
}
