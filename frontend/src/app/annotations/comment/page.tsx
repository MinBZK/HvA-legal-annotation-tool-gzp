// 'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import '../../static/annotations.css'
import {Annotation} from "../../models/annotation";
import {LawClass} from "../../models/lawclass";
import { BsFillTrashFill, BsFillFloppy2Fill, BsX } from "react-icons/bs";
import { Project } from "../../models/project";
import './xml.css'

interface PopupProps {
  project: Project;
}

const Popup: React.FC<PopupProps> = (project) => {

  project.project.xml_content = project.project.xml_content.replace("bwb-inputbestand", "div")

  const [renderXML, setRenderXML] = useState(false);

  useEffect(() => {
    setRenderXML(true);
  }, []);

  const [show, setShow] = useState(false);
  const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
  const [annotation, setAnnotation] = useState<Annotation>();

  useEffect(() => {
    fetchClasses();
  }, []); // Empty dependency array ensures that this effect runs only once

// Update the selected law
  const handleSelectLaw = (lawName: any) => {
    setAnnotation((prevAnnotation) => ({
      ...(prevAnnotation as Annotation),
      lawClass: lawName,
    }));
  };

  const handleNote = (note: any) => {
    setAnnotation((prevAnnotation) => ({
      ...(prevAnnotation as Annotation),
      text: note,
    }));
  };

  const handleSelectedText = (text: any) => {
    setAnnotation((prevAnnotation) => ({
      ...(prevAnnotation as Annotation),
      selectedWord: text,
    }));
  };

  const fetchClasses = () => {
    fetch('http://localhost:8000/api/classes')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch laws');
          }
          return response.json();
        })
        .then(data => setClasses(data))
        .catch(error => console.error('Error fetching laws:', error));
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
  const saveAnnotationToBackend = () => {
    const backendAnnotation = {
      id: null,
      selectedWord: annotation?.selectedWord,
      text: annotation?.text,
      lawClass: { name: annotation?.lawClass },
      project: { id: 1 },
    };

    fetch('http://localhost:8000/api/annotations/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendAnnotation),
    })
        .then(response => {
          console.log(JSON.stringify(backendAnnotation));
          if (!response.ok) {
            throw new Error('Failed to save annotation');
          }
          console.log('Annotation saved successfully');
          handleClose();
        })
        .catch(error => {
          console.error('Error saving annotation:', error);
          console.log("hi");
        });
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
          {annotation?.selectedWord && <p><b>Geselecteerde tekst: </b> {annotation?.selectedWord}</p>}
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label><b>Wet vorm</b></Form.Label>
              <Dropdown>
                <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic" style={{ color: 'black', backgroundColor: annotation?.lawClass ? (classes.find(law => law.name === annotation.lawClass.toString()) || {}).color || ''
                      : '',
                }}>
                  {annotation?.lawClass ? <>{annotation.lawClass}</> : <>Selecteer</>}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown">
                  {classes.map((law, index) => (
                      <Dropdown.Item
                          key={index}
                          onClick={() => handleSelectLaw(law.name)}
                          active={annotation?.lawClass && law.name === annotation.lawClass.toString()}
                          style={{ backgroundColor: law.color, color: 'black' }}
                      >
                        {law.name}
                      </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label className="padding"><b>Notitie</b></Form.Label>
              <Form.Control as="textarea" type="text" placeholder="Type hier uw notitie..." value={annotation?.text}
                            onChange={(e) => handleNote(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label><b>Begrip</b></Form.Label>
              <Form.Control type="text" placeholder="Type hier uw notitie..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={saveAnnotationToBackend}>
            <BsFillFloppy2Fill size={20}/> Opslaan
          </Button>
          <Button className="warning-text-color" variant="warning" onClick={handleClose}>
            <BsX size={20}/> Annuleer
          </Button>
          <Button variant="danger" onClick={handleClose}>
            <BsFillTrashFill size={20}/> Verwijder
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Popup;
