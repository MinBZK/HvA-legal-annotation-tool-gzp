'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import '../../static/annotations.css'
import { BsFillTrashFill, BsFillFloppy2Fill, BsX } from "react-icons/bs";
import { Project } from "../project";
import './xml.css'

interface PopupProps {
  project: Project;
}

const Popup: React.FC<PopupProps> = (project) => {

  project.project.xml_content = project.project.xml_content.replace("bwb-inputbestand", "div")
  
  const [originalXML, setOriginalXML] = useState<Document | null>(null);
  const [renderXML, setRenderXML] = useState(false);

  useEffect(() => {
    setRenderXML(true);

    let parser = new DOMParser();
    let xml = parser.parseFromString(project.project.xml_content, "application/xml");
    setOriginalXML(xml);

  }, [project.project.xml_content]);

  const [show, setShow] = useState(false);
  const [classes, setClasses] = useState<string[]>([]); // New state to store the laws
  const [annotation, setAnnotation] = useState({
    selectedText: null,
    selectedLaw: null,
    note: '',
  });

  // Update the selected law
  const handleSelectLaw = (lawName) => {
    setAnnotation((prevAnnotation) => ({
      ...prevAnnotation,
      selectedLaw: lawName,
    }));
  };

  const handleNote = (note) => {
    setAnnotation((prevAnnotation) => ({
      ...prevAnnotation,
      note: note,
    }));
  };

  const handleSelectedText = (text) => {
    setAnnotation((prevAnnotation) => ({
      ...prevAnnotation,
      selectedText: text,
    }));
  };

  useEffect(() => {
    // Fetch laws from the backend when the component mounts
    fetchClasses();
  }, []); // Empty dependency array ensures that this effect runs only once

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/classes');
      if (!response.ok) {
        throw new Error('Failed to fetch laws');
      }
      const data = await response.json();
      setClasses(data); // Set the laws in the state]
    } catch (error) {
      console.error('Error fetching laws:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString() : null;

    if (text) {
      handleSelectedText(text);
      setShow(true);
    }
  };

    const handleSave = async () => {
        const annotationId = await saveAnnotationToBackend();
        if (annotation.selectedText && annotationId) {
            annotateSelectedText(annotation.selectedText, annotationId);
            addAnnotationTagsToXml();
        }
    };

    const annotateSelectedText = (selectedText: string, annotationId: number) => {
        if (originalXML) {
            walkTheNode(originalXML.documentElement, function(node) {
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.includes(selectedText)) {
                    let annotatedText = node.nodeValue.replace(selectedText, `<annotation id="${annotationId}">${selectedText}</annotation>`);
                    node.nodeValue = annotatedText;
                }
            });
            let updatedXMLString = new XMLSerializer().serializeToString(originalXML);
            project.project.xml_content = updatedXMLString.replace(/&lt;annotation id="[0-9]+"&gt;/g, `<annotation id="${annotationId}">`).replace(/&lt;\/annotation&gt;/g, '</annotation>');
        }
    };

const saveAnnotationToBackend = async () => {
  try {
      const backendAnnotation = {
          id: null,
          selectedWord: annotation.selectedText,
          text: annotation.note,
          lawClass: { name: annotation.selectedLaw },
          project: { id: 1 },
      };

      const response = await fetch('http://localhost:8000/api/annotations/project', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendAnnotation),
      });

      if (!response.ok) {
          throw new Error('Failed to save annotation');
      }

      const responseData = await response.json();

      handleClose();

      return responseData.id;
  } catch (error) {
      console.error('Error saving annotation:', error);
  }
};

const addAnnotationTagsToXml = async () => {
  try {
      const updatedProject = {
          ...project.project,
          xml_content: project.project.xml_content
      };

      const response = await fetch('http://localhost:8000/api/saveXml', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProject)
      });

      if (!response.ok) {
          throw new Error('Failed to update XML');
      }

      console.log('XML updated successfully');
      handleClose();
  } catch (error) {
      console.error('Error updating XML:', error);
  }
};


  return (
    <>
      <p onMouseUp={handleShow} dangerouslySetInnerHTML={{ __html: renderXML && project.project.xml_content }}>
      </p>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Annoteer de tekst</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {annotation.selectedText && <p><b>Geselecteerde tekst: </b> {annotation.selectedText}</p>}
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label><b>Wet vorm</b></Form.Label>
              <Dropdown>
                <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic" style={{ color: 'black', backgroundColor: annotation.selectedLaw ? classes.find(law => law.name === annotation.selectedLaw)?.color : '' }}
                >
                  {annotation.selectedLaw || 'Selecteer'}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown">
                  {classes.map((law, index) => (
                    <Dropdown.Item key={index} onClick={() => handleSelectLaw(law.name)}
                      active={annotation.selectedLaw === law.name} style={{ backgroundColor: law.color, color: 'black' }}>
                      {law.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label className="padding"><b>Notitie</b></Form.Label>
              <Form.Control as="textarea" type="text" placeholder="Type hier uw notitie..." value={annotation.note}
                onChange={(e) => handleNote(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label><b>Begrip</b></Form.Label>
              <Form.Control type="text" placeholder="Type hier uw notitie..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            <BsFillFloppy2Fill size={20} /> Opslaan
          </Button>
          <Button className="warning-text-color" variant="warning" onClick={handleClose}>
            <BsX size={20} /> Annuleer
          </Button>
          <Button variant="danger" onClick={handleClose}>
            <BsFillTrashFill size={20} /> Verwijder
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Popup;

function walkTheNode(node: Node, callback: (node: Node) => void) {
  callback(node);
  node = node.firstChild!;
  while (node) {
      walkTheNode(node, callback);
      node = node.nextSibling!;
  }
}