'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {FC, useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal} from 'react-bootstrap';
import '../../static/annotations.css'
import {BsFillFloppy2Fill, BsFillTrashFill, BsX} from "react-icons/bs";
import {Project} from "../../models/project";
import './xml.css'
import {Annotation} from "../../models/annotation";
import {LawClass} from "../../models/lawclass";

interface PopupProps {
  project: Project;
}

const Popup: FC<PopupProps> = ({ project }) => {

  project.xml_content = project.xml_content.replace("bwb-inputbestand", "div")
  const [renderXML, setRenderXML] = useState(false);
  const [projectId, setProjectId] = useState<number>(0);
  const [originalXML, setOriginalXML] = useState<Document | null>(null);

  useEffect(() => {

    let parser = new DOMParser();
    let xml = parser.parseFromString(project.xml_content, "application/xml");
    setOriginalXML(xml);

    setRenderXML(true);
    fetchId();
    fetchClasses();
  }, [project.xml_content]);


  const fetchId = async () => {
    try {
      const searchParams = await new URLSearchParams(window.location.search);
      const projectId = parseInt(searchParams.get("id") as string) || 2
      setProjectId(projectId)
    } catch (error) {
      console.error("Error fetching annotations:", error);
    }
  };

  const [show, setShow] = useState(false);
  const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
  const [annotation, setAnnotation] = useState<Annotation>();

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
  const saveAnnotationToBackend = async () => {
    const backendAnnotation = {
      id: null,
      selectedWord: annotation?.selectedWord,
      text: annotation?.text,
      lawClass: {name: annotation?.lawClass},
      project: {id: projectId},
    };
    try {
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
      console.log('Annotation saved successfully');
      handleClose();
      return responseData.id;
    } catch (error) {
      console.error('Error saving annotation:', error);
      return null;
    }
  };

  const addAnnotationTagsToXml = async () => {
    console.log("ameland")
    try {
      const updatedProject = {
        ...project,
        xml_content: project.xml_content
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


  const handleSave = async () => {
    const annotationId = await saveAnnotationToBackend();
    if (annotationId && annotation?.selectedWord) {
      annotateSelectedText(annotation.selectedWord, annotationId);
      await addAnnotationTagsToXml();
    } else {
      console.error('Failed to retrieve annotation ID');
    }
  };

  const annotateSelectedText = (selectedText: string, annotationId: number) => {
    if (originalXML) {
      walkTheNode(originalXML.documentElement, function (node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.includes(selectedText)) {
          let annotatedText = node.nodeValue.replace(selectedText, `<annotation id="${annotationId}">${selectedText}</annotation>`);
          node.nodeValue = annotatedText;
        }
      });
      let updatedXMLString = new XMLSerializer().serializeToString(originalXML);
      project.xml_content = updatedXMLString.replace(/&lt;annotation id="[0-9]+"&gt;/g, `<annotation id="${annotationId}">`).replace(/&lt;\/annotation&gt;/g, '</annotation>');
    }
  };


  function walkTheNode(node: Node, callback: (node: Node) => void) {
    callback(node);
    node = node.firstChild!;
    while (node) {
      walkTheNode(node, callback);
      node = node.nextSibling!;
    }
  }


  return (
      <>
        <p onMouseUp={handleShow} dangerouslySetInnerHTML={{__html: renderXML && project.xml_content}}>
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
                  <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic" style={{
                    color: 'black',
                    backgroundColor: annotation?.lawClass ? (classes.find(law => law.name === annotation.lawClass.toString()) || {}).color || ''
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
                            style={{backgroundColor: law.color, color: 'black'}}
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
                              onChange={(e) => handleNote(e.target.value)}/>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label><b>Begrip</b></Form.Label>
                <Form.Control type="text" placeholder="Type hier uw notitie..."/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSave}>
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
}

export default Popup;

