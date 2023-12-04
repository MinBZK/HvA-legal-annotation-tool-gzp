'use client'
import Link from 'next/link';
import { FiTrash2 } from 'react-icons/fi';
import './static/index.css';
import { Modal, Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {

  const [modalOpen, setModalOpen] = React.useState(false);
  // Mock data for the list of documents
  const documents = [
    { id: 1, title: 'XML annotate example title' },
    { id: 2, title: 'XML annotate example title' },
    { id: 3, title: 'XML annotate example title' },
    { id: 4, title: 'XML annotate example title' },
  ];

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <header className="header">
        <h1>Legal Annotation Tool</h1>
        <Button
          color="primary"
          type="button"
          onClick={handleShow}
        >
          Importeer
        </Button>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload bestand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="">
            <input type="file" accept="text/xml" className='d-block' />
            <Button className='success float-end mt-3' onClick={handleClose}>
            Upload
          </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
