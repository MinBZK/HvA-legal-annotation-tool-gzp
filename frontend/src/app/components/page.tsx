'use client';
import React, { useState } from 'react';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Popup: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <p onClick={handleShow}>Click me to open the popup</p>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Popup Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Dropdown
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Text Field 1</Form.Label>
              <Form.Control type="text" placeholder="Enter text" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label>Text Field 2</Form.Label>
              <Form.Control type="text" placeholder="Enter text" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Popup;