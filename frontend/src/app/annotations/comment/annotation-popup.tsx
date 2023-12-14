'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, Dropdown, Form, Modal} from 'react-bootstrap';
import '../../static/annotations.css'
import {BsFillFloppy2Fill, BsFillTrashFill, BsX} from "react-icons/bs";
import {Project} from "../../models/project";
import './xml.css'
import {Annotation} from "../../models/annotation";
import {LawClass} from "../../models/lawclass";
import {Term} from "@/app/models/term";

interface PopupProps {
  project: Project;
}

const Popup: FC<PopupProps> = ({ project }) => {

  project.xml_content = project.xml_content.replace("bwb-inputbestand", "div")
  const [annotationStyles, setAnnotationStyles] = useState({});
  const [renderXML, setRenderXML] = useState(false);
  const [projectId, setProjectId] = useState<number>(0);
  const [originalXML, setOriginalXML] = useState<Document | null>(null);
  const [show, setShow] = useState(false);
  const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
  const [annotation, setAnnotation] = useState<Annotation>();
  const [lawClassError, setLawClassError] = useState(false);

  useEffect(() => {
    // Convert the XML string to a readable DOM object
    let parser = new DOMParser();
    let xml = parser.parseFromString(project.xml_content, "application/xml");
    setOriginalXML(xml);

    setRenderXML(true);
    fetchId();
    fetchClasses();

    fetchAnnotationsAndStyles(xml);
  }, [project.xml_content]);

  /**
   * Fetches annotation data for each annotation tag in the given XML document.
   * For each annotation, it retrieves the color associated with its law class and adds it as a CSS rule, which is later
   * applied to the page.
   *
   * @param {Document} xmlDoc - The XML document containing annotation tags.
   */
  const fetchAnnotationsAndStyles = async (xmlDoc: Document) => {
    const annotations = xmlDoc.getElementsByTagName('annotation');
    let newAnnotationStyles: any = {};

    // Loop through all annotations and fetch the annotation data
    // @ts-ignore
    // Loop through all annotations and fetch the annotation data
    for (let annotation of annotations) {
      const id = annotation.getAttribute('id');
      if (id) {
        const response = await fetch(`http://localhost:8000/api/annotations/${id}`);
        if (response.ok) {
          const annotationData = await response.json();
          // Add a null check before accessing the lawClass property
          if (annotationData && annotationData.lawClass) {
            newAnnotationStyles[`${id}`] = annotationData.lawClass.color;
          } else {
            console.error('Annotation data or lawClass property is null or undefined');
          }
        } else {
          console.error('Failed to fetch annotation data');
        }
      }
    }


    setAnnotationStyles(newAnnotationStyles);
  };

  /**
   * Generates CSS styles for annotations based on their id and the associated color.
   * It creates a string of CSS rules that is later added to the HTML.
   *
   * @returns {string} A string of CSS rules for styling annotations.
   */
  const renderStyles = () => {
    let styleString = "";
    for (const [selector, color] of Object.entries(annotationStyles)) {
      styleString += `annotation[id="${selector}"] { background-color: ${color}; }\n`;
    }
    return styleString;
  };

  const fetchId = async () => {
    try {
      const searchParams = await new URLSearchParams(window.location.search);
      const projectId = parseInt(searchParams.get("id") as string) || 0
      setProjectId(projectId)
    } catch (error) {
      console.error("Error fetching annotations:", error);
    }
  };

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

  const handleTerm = (term: any) => {
    setAnnotation((prevAnnotation) => ({
      ...(prevAnnotation as Annotation),
      term: term,
    }));
  };

  const handleSelectedText = (text: string, startOffset: number, term: Term) => {
    setAnnotation((prevAnnotation) => ({
      ...(prevAnnotation as Annotation),
      selectedWord: text,
      startOffset: startOffset,
      term: term
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
    setLawClassError(false);
  };

  /**
   * This event handler is triggered when the user selects text in the XML content and shows the popup.
   */
  const handleShow = () => {
    const selection = window.getSelection();

    // Check if the selection is valid
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();

      if (text) {
        const startOffset = calculateOffset(range.startContainer, range.startOffset);
        handleSelectedText(text, startOffset);
        setShow(true);
      }
    }
  };

  /**
   * Calculates the offset of the selected text in the XML content relative to the start of the document.
   *
   * @param node
   * @param offset
   */
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

  /**
   * Updates the XML content with new annotation tags based on the users selection.
   * Sends the updated XML content to the backend server to be saved.
   */
  const addAnnotationTagsToXml = async () => {
    try {
      // Create a copy of Project to avoid mutating the original object
      const updatedProject = {
        ...project,
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

  /**
   * Handles the save button click.
   * Saves the annotation to the backend and adds the annotation tags to the XML content.
   */
  const handleSave = async () => {
    // Check if the law class is selected before saving
    if (!annotation?.lawClass) {
      setLawClassError(true);
      return;
    }
    setLawClassError(false);
    const annotationId = await saveAnnotationToBackend();
    if (annotationId && annotation?.selectedWord && typeof annotation.startOffset === 'number') {
      annotateSelectedText(annotation.selectedWord, annotationId, annotation.startOffset);
      await addAnnotationTagsToXml();
    } else {
      console.error('Failed to retrieve annotation ID');
    }
  };

  /**
   * Adds annotation tags to the XML content based on the users selection.
   *
   * @param selectedText
   * @param annotationId
   * @param startOffset
   */
  const annotateSelectedText = (selectedText: string, annotationId: number, startOffset: number) => {
    if (originalXML) {
      let currentOffset = 0;
      let annotationAdded = false;

      // Loop through all text nodes in the XML content until the node containing the selected text is found
      walkTheNode(originalXML.documentElement, function (node) {
        if (node.nodeType === Node.TEXT_NODE && !annotationAdded) {
          const nodeLength = node.nodeValue?.length || 0;

          if (currentOffset + nodeLength > startOffset) {
            const textIndex = node.nodeValue?.indexOf(selectedText);

            if (typeof textIndex === 'number' && textIndex !== -1 && currentOffset + textIndex >= startOffset) {
              const newNodeValue = node.nodeValue
                  ? node.nodeValue.substring(0, textIndex) +
                  `<annotation id="${annotationId}">${selectedText}</annotation>` +
                  node.nodeValue.substring(textIndex + selectedText.length)
                  : '';

              node.nodeValue = newNodeValue;
              annotationAdded = true;
            }
          }
          currentOffset += nodeLength;
        }
      });

      if (annotationAdded) {
        // Convert the XML DOM back to a string
        let serializedXML = new XMLSerializer().serializeToString(originalXML);
        // Replace the escaped annotation tags with the original tags
        project.xml_content = serializedXML.replace(/&lt;annotation id="([0-9]+)"&gt;/g, `<annotation id="$1">`)
            .replace(/&lt;\/annotation&gt;/g, '</annotation>');
      }
    }
  };

  /**
   * A recursive function that walks through all nodes in the XML content. This is used by the annotateSelectedText
   * in combination with a callback function to find the node containing the selected text.
   *
   * @param node
   * @param callback
   */
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
        <style>
          {renderStyles()}
        </style>

        <p className="xml-content" onMouseUp={handleShow} dangerouslySetInnerHTML={{__html: renderXML && project.xml_content}}>
        </p>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Annoteer de tekst</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {lawClassError && (
                <Alert variant="danger">
                  <Alert.Heading>Error</Alert.Heading>
                  <p>Selecteer alstublieft een juridische klasse.</p>
                </Alert>
            )}
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
                <Form.Control className={"text-input"} as="textarea" type="text" placeholder="Type hier uw notitie..." value={annotation?.text}
                              onChange={(e) => handleNote(e.target.value)}/>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label><b>Begrip</b></Form.Label>
                <Form.Control
                    as="textarea"
                    type="text"
                    placeholder="Type hier uw begrip..."
                    // value={annotation?.term?.reference || ''} // Assuming 'name' is the property you want to display
                    // onChange={(e) => handleTerm(e.target.value)}
                />
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

