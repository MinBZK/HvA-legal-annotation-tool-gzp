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

  const handleSelectedText = (text: string, startOffset: number) => {
    setAnnotation((prevAnnotation) => ({
      ...(prevAnnotation as Annotation),
      selectedWord: text,
      startOffset: startOffset,
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
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();

      if (text) {
        // Bereken de totale positie van de selectie in de tekst
        const startOffset = calculateOffset(range.startContainer, range.startOffset);
        handleSelectedText(text, startOffset);
        setShow(true);
      }
    }
  };

  // Bereken de totale positie van de selectie in de tekst
  function calculateOffset(node: Node, offset: number): number {
    let count = offset;
    while (node.previousSibling) {
      node = node.previousSibling;
      count += node.textContent?.length || 0; 
    }
    return count;
  }

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
    if (annotationId && annotation?.selectedWord && typeof annotation.startOffset === 'number') {
      annotateSelectedText(annotation.selectedWord, annotationId, annotation.startOffset);
      await addAnnotationTagsToXml();
    } else {
      console.error('Failed to retrieve annotation ID');
    }
  };

  const annotateSelectedText = (selectedText: string, annotationId: number, startOffset: number) => {
    if (originalXML) {
      let currentOffset = 0;
      let annotationAdded = false;

      walkTheNode(originalXML.documentElement, function (node) {
        if (node.nodeType === Node.TEXT_NODE && !annotationAdded) {
          const nodeLength = node.nodeValue?.length || 0;

          if (currentOffset + nodeLength > startOffset) {
            const textIndex = node.nodeValue?.indexOf(selectedText);

            if (textIndex !== -1 && currentOffset + textIndex >= startOffset) {
              node.nodeValue = node.nodeValue?.substring(0, textIndex) +
                  `<annotation id="${annotationId}">${selectedText}</annotation>` +
                  node.nodeValue.substring(textIndex + selectedText.length);

              annotationAdded = true;
            }
          }
          currentOffset += nodeLength;
        }
      });

      if (annotationAdded) {
        let serializedXML = new XMLSerializer().serializeToString(originalXML);
        // Vervang de tijdelijke annotatie-tags door de daadwerkelijke tags
        project.xml_content = serializedXML.replace(/&lt;annotation id="([0-9]+)"&gt;/g, `<annotation id="$1">`)
            .replace(/&lt;\/annotation&gt;/g, '</annotation>');
      }
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

