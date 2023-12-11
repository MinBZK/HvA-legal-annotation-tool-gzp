'use client'
import { FiTrash2 } from 'react-icons/fi';
import './static/index.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import React, {useEffect, useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getProjects, uploadXML} from './services/project'
import {Project} from "./models/project";
import { BsDownload } from "react-icons/bs";
import Link from 'next/link';

export default function Home() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch the list of projects when the component mounts
    fetchProjects();
  }, []);

  const handleProjectSelection = (projectId: number) => {
    window.location.href = `/annotations?id=${projectId}`;
  };

  const fetchProjects = async () => {
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

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
    }
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
                          onClick={handleShow}>
                          <BsDownload className="download-icon" size={20}/>
                          Importeer XML
                      </button>
                  </div>
          <ul className="document-list">
            {projects.map((project) => (
                <li key={project.id} className="document-item">
                    <div className="document-info">
                        <span className="document-title">Wet {project.id}</span>
                    </div>
                    <div className="actions">
                        <Link href={{ pathname: '/annotations', query: { id: project.id } }} passHref>
                            <button className="open-button">Open project</button>
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
                  ref={fileInputRef}
              />
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
