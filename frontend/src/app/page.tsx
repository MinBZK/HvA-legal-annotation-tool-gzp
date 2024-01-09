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
import Navigation from './components/navigation/navigation';
import { getSelectedUser, getUser, subscribe, unsubscribe } from './services/user';
import { User } from './models/user';

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

  const [maxXmlCount, setMaxXmlCount] = useState(40);
  const [currentXmlCount, setCurrentXmlCount] = useState(0);
  const [xmlDoc, setXmlDoc] = useState<any>();
  const [eventTargetResult, setEventTargetResult] = useState<any>();

  const [onArticlesShow, setOnArticlesShow] = useState<boolean>(false);
  const [articlePieces, setArticlePieces] = useState<any[]>([]);
  const [articleChecked, setArticleChecked] = useState<boolean[]>([]);
  const [selectedArticlesIds, setSelectedArticleIds] = useState<string[]>([]);

  const [reloadXml, setReloadXml] = useState(false);
  const [activeUserRole, setActiveUserRole] = useState<string>();

  useEffect(() => {
    // Subscribe to changes in the selected user
    const handleUserChange = (user: User) => {
      // Handle the change in the component
      setActiveUserRole(user.role);
    };

    subscribe(handleUserChange);

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe(handleUserChange);
    };
  }, []);

  // Wrapper function to handle close and show of upload modal
  const handleClose = () => {
    setShow(false);
    setOnArticlesShow(false);
  };
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
    if (currentXmlCount >= maxXmlCount) {
      setShowMaxXmlWarning(true);
    } else {
      setShowMaxXmlWarning(false);
    }
  }, [currentXmlCount, maxXmlCount]);


  const fetchMaxXmlCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/maxXmlCount');
      if (response.ok) {
        const maxCount = await response.json();
        setMaxXmlCount(maxCount);
      } else {
        console.error('Response not ok', response);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching max XML count:', error);
    }
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
          setEventTargetResult(event.target.result)
          setXmlDoc(parser.parseFromString(event.target.result, 'application/xml'));
        }
      };
    }
  };

  useEffect(() => {
    if (xmlDoc != null) {
      const listArticles = xmlDoc.querySelectorAll("artikel")

      // check if children exist
      if (listArticles == null || listArticles.length == 0) {
        alert("no articles in xml")
      }

      const arrArticle: any[] = []
      const arrArticleBools: boolean[] = []
      for (let i = 0; i < listArticles.length; i++) {
        arrArticle.push(listArticles.item(i))
        arrArticleBools.push(false)
      }

      setArticlePieces(arrArticle)
      setArticleChecked(arrArticleBools)
    }
  }, [xmlDoc]);

  const startUpload = async (list: string[]) => {
    const citeertitelElement = xmlDoc.querySelector('citeertitel');

    if (citeertitelElement && citeertitelElement.childNodes.length > 0) {
      const firstChildNode = citeertitelElement.childNodes[0];

      if (firstChildNode && firstChildNode.nodeValue !== null) {
        const title = firstChildNode.nodeValue.trim();
        let selectedArticles: any = null


        if (list.length > 0) {
          selectedArticles = list.join(', ');
        }
        console.warn(selectedArticles)

        const response = await uploadXML(eventTargetResult, title, selectedArticles);

        // Check the status of the response
        if (response.status == 201) {
          await fetchProjects();
          await fetchProjectCounts()
          setShow(false);
        } else {
          setErrorMsg("Er is iets fout gegaan bij het uploaden");
          setShowError(true);
        }
        handleReload()
      } else {
        setErrorMsg("De XML bevat geen citeertitel");
        setShowError(true);
      }
    } else {
      setErrorMsg("De XML bevat geen citeertitel");
      setShowError(true);
    }
  }

  const checkHandler = (index: number) => {
    setArticleChecked(prevState => {
      const newList = [...articleChecked];
      newList[index] = !newList[index]
      return newList
    })
  }

  const collectSelectedArticles = (isSelectedAll?: boolean) => {
    if (isSelectedAll) {
      startUpload([])
      handleClose()
    } else {
      const list: string[] = [];

      for (let i = 0; i < articlePieces.length; i++) {
        if (articleChecked[i]) {
          list.push(articlePieces[i].id)
        }
      }

      if (list.length > 0) {
        setSelectedArticleIds(list)
        setTimeout(() => {
          startUpload(list)
        }, 1000);
      }
    }

  }

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

  const disableCheck: () => boolean = () => {
    return articleChecked.includes(true);
  };

  return (
    <>
      <Navigation></Navigation>
      <div className="container-md container-sm">
        <main className="main-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="doc-text">Documenten</h2>
            <p className='xml-minmax'>{currentXmlCount}/{maxXmlCount} XML&apos;s beschikbaar</p>
            <Alert show={showMaxXmlWarning} variant="warning">
              U heeft het maximale aantal van {maxXmlCount} XML&apos;s bereikt. Verwijder eerst een XML voordat u verder gaat.
            </Alert>
            {
              activeUserRole == "Admin" || activeUserRole == "Jurist" ? <button
                className="import-button"
                onClick={handleShow}>
                <BsDownload className="download-icon" size={20} />
                <span>Importeer XML</span>
              </button> : <div></div>
            }

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
                  {
                    activeUserRole == "Admin" ? <button
                      className='delete-button'
                      onClick={() => handleShowDeleteModal(project.id)}>
                      <FiTrash2 className="delete-icon" />
                    </button> : ""
                  }
                </div>
              </li>
            ))}
          </ul>

        </main>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            {onArticlesShow ? (
              <Modal.Title>Selecteer artikelen</Modal.Title>
            ) : (
              <Modal.Title>Upload bestand</Modal.Title>
            )
            }
          </Modal.Header>
          <Modal.Body>
            {onArticlesShow ? (
              <>
                {articlePieces && articlePieces.map((value, index) => (
                  <div key={index} className={"m-1"}>
                    <label className={"d-flex align-content-center"}>
                      <input type={"checkbox"} checked={articleChecked[index]}
                        onChange={() => checkHandler(index)}
                      />
                      <p className={"m-1"}>
                        {value.getAttribute('label')}
                        &nbsp;
                        {value.getElementsByTagName("kop")[0]?.getElementsByTagName("titel")[0]?.textContent}
                      </p>
                    </label>


                  </div>
                ))}

                <Button className='success float-end mt-3' disabled={!disableCheck()} onClick={() => {
                  collectSelectedArticles()
                }}>
                  Bevestig selectie
                </Button>

                <Button className='info float-end m-2 mt-3' onClick={() => {
                  collectSelectedArticles(true)
                }}>
                  Selecteer alles
                </Button>


              </>

            ) : (
              <>
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
                  <Button type='submit' className='success float-end mt-3' onClick={() => {
                    if (articlePieces != null) {
                      handleXmlUpload()
                      setOnArticlesShow(true)
                    }
                  }}>
                    Verder
                  </Button>
                </Form>
              </>
            )
            }
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
