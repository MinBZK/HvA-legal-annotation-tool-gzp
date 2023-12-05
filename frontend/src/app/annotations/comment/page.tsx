'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import '../../static/annotations.css'
import { BsFillTrashFill, BsFillFloppy2Fill, BsX} from "react-icons/bs";

const Popup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [classes, setClasses] = useState<string[]>([]); // New state to store the laws

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

      // If selectedLaw is not set, default to the first law in the list
      if (!selectedLaw && data.length > 0) {
        setSelectedLaw(data[0].name);
      }
    } catch (error) {
      console.error('Error fetching laws:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedText(null);
    setNote('');
    setTerm('');

    saveAnnotationToBackend();
    callXmlController();
  };

  const handleShow = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString() : null;

    if (text) {
      setSelectedText(text);
      setShow(true);
    }
  };

  const saveAnnotationToBackend = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/saveAnnotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedText,
          selectedLaw,
          note,
          term,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save annotation');
      }

      console.log('Annotation saved successfully');
    } catch (error) {
      console.error('Error saving annotation:', error);
    }
  };

  const callXmlController = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/saveXml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Include relevant data for saving XML in the request body
          // For example, you might pass the selectedText or other relevant information
          selectedText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to call XML controller');
      }

      console.log('XML controller called successfully');
    } catch (error) {
      console.error('Error calling XML controller:', error);
    }
  };

  return (
    <>
      <p onMouseUp={handleShow}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium, leo quis fermentum hendrerit, sapien turpis molestie dolor, sed varius massa purus sit amet quam.
         Donec elementum, est quis gravida dignissim, ante dui porttitor est, vel ullamcorper massa lacus sit amet orci. 
         Duis lorem lorem, sodales in leo iaculis, ultricies blandit dui. Suspendisse semper turpis vitae consectetur luctus. Suspendisse ac lorem odio. 
         Duis eu mauris ut ligula dictum facilisis. Morbi iaculis pretium turpis, ut lobortis purus ullamcorper vulputate. Nullam nec diam nibh.
        Curabitur elementum imperdiet congue. Suspendisse tincidunt ante sem, eget volutpat tortor ornare a. Suspendisse potenti. Aenean sed sem finibus, feugiat arcu ac, 
        finibus mauris. Duis elit turpis, dapibus a elementum sed, ultrices in lorem. Etiam pulvinar, mauris ut ultricies aliquet, ipsum nulla fringilla dolor, eu convallis 
        diam mi sit amet nisi. Nam turpis augue, interdum ut finibus eget, aliquam at ligula.Duis eu congue justo, sit amet elementum sapien. Phasellus tristique ullamcorper 
        nisi. Nunc eu ornare erat. Nullam viverra a lectus eget pretium. Suspendisse commodo tincidunt sodales. Maecenas sit amet tempus est, condimentum ornare felis. Aenean 
        mollis tellus vitae orci volutpat efficitur. Nulla erat mauris, rhoncus non sem mollis, venenatis faucibus nisl. Praesent placerat risus vitae velit condimentum, at 
        maximus ante vestibulum. Aenean mi sapien, viverra vitae fermentum at, posuere ut dolor. Fusce scelerisque ligula risus, sit amet auctor lectus facilisis sit amet.
      </p>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Annoteer de tekst</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedText && <p><b>Geselecteerde tekst: </b> {selectedText}</p>}
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label><b>Wet vorm</b></Form.Label>
              <Dropdown>
                <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic">
                  {selectedLaw || 'Selecteer'}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown">
                  {classes.map((law, index) => (
                      <Dropdown.Item key={index} onSelect={() => setSelectedLaw(law.name)}
                                     active={selectedLaw === law.name}>
                        {law.name}
                      </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label className="padding"><b>Notitie</b></Form.Label>
              <Form.Control as="textarea" type="text" placeholder="Type hier uw notitie..." />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label><b>Begrip</b></Form.Label>
              <Form.Control type="text" placeholder="Type hier uw notitie..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
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
