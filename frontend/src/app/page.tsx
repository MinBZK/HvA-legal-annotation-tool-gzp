'use client'
import { FiTrash2 } from 'react-icons/fi';
import './static/index.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMaxXmlCount, getProjectCounts, getProjects, uploadXML } from './services/project'
import { Project } from "./models/project";
import { BsDownload } from "react-icons/bs";
import Link from 'next/link';
import {Annotation} from "@/app/models/annotation";

export default function Home() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [show, setShow] = useState(false); // State variable for controlling visibility of the upload modal
  const [showError, setShowError] = useState(false); // State variable for managing error visibility for the upload
  const [errorMsg, setErrorMsg] = useState("");
  const [showProjectError, setShowProjectError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMaxXmlWarning, setShowMaxXmlWarning] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<number | null>(null);

  const [maxXmlCount, setMaxXmlCount] = useState(0);
  const [currentXmlCount, setCurrentXmlCount] = useState(0);

  const [reloadXml, setReloadXml] = useState(false);

  // Wrapper function to handle close and show of upload modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowDeleteModal = (projectId: number) => {
    setProjectIdToDelete(projectId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setProjectIdToDelete(null);
    setShowDeleteModal(false);
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch the list of projects when the component mounts
    fetchProjects();
    fetchMaxXmlCount();
    fetchProjectCounts();
  }, [reloadXml]);

  useEffect(() => {
    if (currentXmlCount >= 40) {
      setShowMaxXmlWarning(true);
    } else {
      setShowMaxXmlWarning(false);
    }
  }, [currentXmlCount]);

  const fetchMaxXmlCount = async () => {
    const maxCount = await getMaxXmlCount();
    setMaxXmlCount(maxCount);
  };

  const fetchProjectCounts = async () => {
    try {
      const counts = await getProjectCounts();
      setCurrentXmlCount(counts.currentCount);
    } catch (error) {
      console.error('Error fetching project counts:', error);
      setShowProjectError(true);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true); // Set loading to true when starting the fetch
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setShowProjectError(true);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const handleReload = () => {
    setReloadXml((prev) => !prev);
  };

  // Handle XML Upload
  const handleXmlUpload = async () => {
    // Check if file input reference is not null and has a non-empty value
    if (fileInputRef.current != null && fileInputRef.current["value"] != "") {
      const reader = new FileReader();

      // Read the content of the first file in the file input
      reader.readAsText(fileInputRef.current["files"][0]);

      // Handle the 'onload' event when the file reading is complete
      reader.onload = async (event) => {
        // Check if the event target is not null and the result is a string
        if (event.target != null && typeof event.target.result === "string") {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(event.target.result, 'application/xml');
          const citeertitelElement = xmlDoc.querySelector('citeertitel');

          if (citeertitelElement && citeertitelElement.childNodes.length > 0) {
            const firstChildNode = citeertitelElement.childNodes[0];
            if (firstChildNode && firstChildNode.nodeValue !== null) {
              const title = firstChildNode.nodeValue.trim();
              const response = await uploadXML(event.target.result, title);

              // Check the status of the response
              if (response.status == 201) {
                await fetchProjects();
                setShow(false);
              } else {
                setErrorMsg("Er is iets fout gegaan bij het uploaden");
                setShowError(true);
              }
              // amount of xmls reloads whenever there is one added or deleted
              handleReload();
            } else {
              setErrorMsg("De XML bevat geen citeertitel");
              setShowError(true);
            }
          } else {
            setErrorMsg("De XML bevat geen citeertitel");
            setShowError(true);
          }
        }
      };
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/project/${id}/delete`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(id)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        // close modal after success delete xml
        setShowDeleteModal(false);
        // auto reload when xml is deleted
        handleReload();
      } else {
        console.error('Failed to delete xml');
      }
    } catch (error) {
      console.error('Error deleting xml', error);
    }
  };


  return (
    <>
      <div>
        <nav className="navbar">
          {<div className="navbar-title">Legal Annotation Tool</div>}
        </nav>
      </div>
      <div className="container-md container-sm">
        <main className="main-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="doc-text">Documenten</h2>
            <p className='xml-minmax'>{currentXmlCount}/{maxXmlCount} XML&apos;s beschikbaar</p>
            <Alert show={showMaxXmlWarning} variant="warning">
              U heeft het maximale aantal van 40 XML&apos;s bereikt. Verwijder eerst een XML voordat u verder gaat.
            </Alert>
            <button
              className="import-button"
              onClick={handleShow}>
              <BsDownload className="download-icon" size={20} />
              <span>Importeer XML</span>
            </button>
          </div>

          {loading && <p className="loading-message">Loading...</p>}

          <Alert show={showProjectError} variant="danger" dismissible>
            <Alert.Heading>Error</Alert.Heading>
            <p>Something went wrong</p>
          </Alert>

          <ul className="document-list">
            {projects && projects.map((project) => (
              <li key={project.id} className="document-item">
                <div className="document-info">
                  <span className="document-title">{project.title}</span>
                </div>
                <div className="actions">
                  <Link href={{ pathname: '/annotations', query: { id: project.id } }} passHref>
                    <button className="open-button">Open project</button>
                  </Link>
                  <button
                      className='delete-button'
                      onClick={() => handleShowDeleteModal(project.id)}>
                    <FiTrash2 className="delete-icon" />
                  </button>
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
                {errorMsg}
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

        {/*modal for delete xml*/}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Verwijder xml</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert show={showError} variant="danger" dismissible>
              <Alert.Heading>Error</Alert.Heading>
              <p>{errorMsg}</p>
            </Alert>
            <p>Weet u zeker dat u een xml wilt verwijderen?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
                type='submit'
                variant="danger"
                onClick={() => projectIdToDelete && handleDelete(projectIdToDelete)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
