'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, Dropdown, Form, Modal} from 'react-bootstrap';
import '../../static/annotations.css'
import {BsFillFloppy2Fill, BsFillTrashFill, BsX} from "react-icons/bs";
import {Annotation} from "../../models/annotation";
import {LawClass} from "../../models/lawclass";
import {getProjectById} from "../../services/project";
import {Project} from "../../models/project";

interface PopupProps {
    selectedText: string;
    startOffset: number;
    onClose: () => void; // Callback to indicate closing
}

const CreateAnnotation: FC<PopupProps> = ({ selectedText, startOffset, onClose }) => {

    const [projectId, setProjectId] = useState<number>(0);
    const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
    const [lawClassError, setLawClassError] = useState(false);
    const [project, setProject] = useState<Project>({
        id:0
    } as Project);
    const [originalXML, setOriginalXML] = useState<Document | null>(null);
    const [annotation, setAnnotation] = useState<Annotation>({
        id: 0,
        text: "",
        selectedWord: "",
        lawClass: {name:""},
        project: {id:0},
        startOffset: 0
    } as Annotation);

    useEffect(() => {
        fetchId();
        fetchClasses();
        handleSelectedText(selectedText, startOffset);
    }, []);

    const fetchId = async () => {
        try {
            const searchParams = await new URLSearchParams(window.location.search);
            const projectId = parseInt(searchParams.get("id") as string) || 0
            setProjectId(projectId)

            const project = await getProjectById(projectId)
            setProject(project)

            let parser = new DOMParser();
            let xml = parser.parseFromString(project?.xml_content, "application/xml");
            await setOriginalXML(xml);
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
        setLawClassError(false);
        onClose();
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
        <div>
            <p id="annoteren" >Annoteren</p>
            {lawClassError && (
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>Selecteer alstublieft een juridische klasse.</p>
                </Alert>
            )}

            <Form>
                <Form.Group controlId="selectedText">
                    <Form.Label><b>Geselecteerde tekst</b></Form.Label>
                    <Form.Control type="text" readOnly value={annotation?.selectedWord} />
                </Form.Group>

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
                    <Form.Control className={"text-input"} as="textarea" type="text" placeholder="Type hier uw notitie..." value={annotation?.text}
                                  onChange={(e) => handleNote(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label><b>Begrip</b></Form.Label>
                    <Form.Control type="text" placeholder="Type hier uw begrip..." />
                </Form.Group>
            </Form>
        </div>

        <div style={{ padding: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleSave}>
                <BsFillFloppy2Fill size={20} /> Opslaan
            </Button>
            <Button className="warning-text-color" variant="warning" onClick={handleClose}>
                <BsX size={20} /> Annuleer
            </Button>
        </div>
    </>
);
}

export default CreateAnnotation;
