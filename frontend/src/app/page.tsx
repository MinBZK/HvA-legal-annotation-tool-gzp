

'use client'
import { FiTrash2 } from 'react-icons/fi';
import './static/index.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import React, {useEffect, useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getProjects, uploadXML} from './services/project'
import {Project} from "./models/project";

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
            {projects.map((project) => (
                <li key={project.id} className="document-item">
                  <span className="document-title">Wet {project.id}</span>
                  <button
                      className="open-button"
                      onClick={() => handleProjectSelection(project.id)}
                  >
                    Open project
                  </button>
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
  );
}


