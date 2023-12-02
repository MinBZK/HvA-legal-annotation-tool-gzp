'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import '../../static/annotations.css'
import { BsFillTrashFill, BsFillFloppy2Fill, BsX} from "react-icons/bs";


const Popup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const handleClose = () => {
    setShow(false);
    setSelectedText(null);
  };

  const handleShow = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString() : null;

    if (text) {
      setSelectedText(text);
      setShow(true);
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
                  Selecteer
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown">
                  <Dropdown.Item href="#/action-1">Wet 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Wet 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Wet 3</Dropdown.Item>
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
          <Button variant="warning" onClick={handleClose}>
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
