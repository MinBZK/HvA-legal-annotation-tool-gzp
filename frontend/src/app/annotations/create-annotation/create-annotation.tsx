'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { FC, useEffect, useState } from 'react';
import { Alert, Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { BsFillFloppy2Fill, BsFillTrashFill, BsX } from "react-icons/bs";
import { Annotation } from "../../models/annotation";
import { LawClass } from "../../models/lawclass";
import { getProjectById } from "../../services/project";
import { Project } from "../../models/project";
import "./create-annotation.css"
import css from "../../annotation-view/annotated-row/annotated-row.module.css"
import { Term } from "@/app/models/term";
import { Relation } from "@/app/models/relation";
import { getChildAnnotationsFromParentId } from '@/app/services/annotation';


interface PopupProps {
    selectedText: string;
    startOffset: number;
    onClose: () => void; // Callback to indicate closing
    onAnnotationSaved: () => void; // Callback to indicate closing
}

const CreateAnnotation: FC<PopupProps> = ({ selectedText, startOffset, onClose, onAnnotationSaved }) => {

    const [projectId, setProjectId] = useState<number>(0);
    const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
    const [terms, setTerms] = useState<Term[]>([]); // New state to store the laws
    const [relations, setRelations] = useState<Relation[]>([]); // State voor het opslaan van relaties
    const [newTerm, setNewTerm] = useState<Term>({
        id: 0,
        definition: "",
        reference: ""
    } as Term);

    const [lawClassError, setLawClassError] = useState(false);
    const [project, setProject] = useState<Project>({
        id: 0
    } as Project);
    const [originalXML, setOriginalXML] = useState<Document | null>(null);
    const [annotation, setAnnotation] = useState<Annotation>({
        id: 0,
        text: "",
        selectedWord: "",
        lawClass: undefined,
        project: { id: 0 },
        startOffset: 0,
        term: { definition: "", reference: "" }
    } as Annotation);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchId();
        fetchClasses();
        handleSelectedText(selectedText, startOffset);
        fetchTerms(selectedText);
    }, [selectedText, startOffset]);

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
    const handleSelectLaw = async (lawClassName: any) => {
        // Vind het LawClass object op basis van de gegeven naam
        const selectedLawClass = classes.find(lawClass => lawClass.name === lawClassName);

        if (selectedLawClass) {
            // Sla alleen de naam van de LawClass op in de annotation
            setAnnotation((prevAnnotation) => ({
                ...(prevAnnotation as Annotation),
                lawClass: lawClassName, // Sla de naam van de LawClass op
            }));

            // Haal de relaties op voor de geselecteerde LawClass
            await fetchRelationsForLawClass(selectedLawClass.id); // Gebruik het ID van de gevonden LawClass
        }
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

    const fetchTerms = (reference: any) => {
        console.log(reference)
        fetch(`http://localhost:8000/api/terms/${encodeURIComponent(reference)}`)
            .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch terms');
            }
                return response.json();
            })
            .then(data => setTerms(data))
            .catch(error => console.error('Error fetching terms:', error));
    }

    const handleAddTerm = async () => {
        try {
            await handleTerm(newTerm);
            setShowModal(false);
        } catch (error) {
            console.error('Error saving annotation:', error);
            return null;
        }
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
            term: { definition: annotation?.term?.definition|| undefined, reference: annotation?.selectedWord},
        };
        try {
            const response = await fetch('http://localhost:8000/api/annotations/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendAnnotation),
            });

            console.log(JSON.stringify(backendAnnotation));

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
            annotateSelectedText(annotation.selectedWord, annotationId, annotation.startOffset, annotation.term.definition);
            await addAnnotationTagsToXml();

            // Trigger the callback to re-render LoadXML
            if (onAnnotationSaved) {
                onAnnotationSaved();
            }
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
     * @param definition
     */
    const annotateSelectedText = (selectedText: string, annotationId: number, startOffset: number, definition: string) => {
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

    const fetchRelationsForLawClass = async (lawClassId: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/relations/${lawClassId}`);
            if (response.ok) {
                const fetchedRelations = await response.json();
                setRelations(fetchedRelations);
            } else {
                console.error("Error fetching relations");
            }
        } catch (error) {
            console.error("Error fetching relations:", error);
        }
    };



    return (
        <>
            <div>
                <p id="annoteren">Annoteren</p>
                {lawClassError && (
                    <Alert variant="danger">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>Selecteer alstublieft een juridische klasse.</p>
                    </Alert>
                )}

                <Form className="annotationInfo">
                    <Form.Group controlId="selectedText">
                        <Form.Label><b>Geselecteerde tekst</b></Form.Label>
                        <Form.Control type="text" readOnly value={annotation?.selectedWord} />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label><b>Wet vorm</b></Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic" style={{
                                color: 'black',
                                backgroundColor: annotation?.lawClass ? (classes.find(law => law.name === annotation.lawClass?.toString()) || {}).color || ''
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
                        <Form.Control className={"text-input"} as="textarea" type="text"
                            placeholder="Type hier uw notitie..." value={annotation?.text}
                            onChange={(e) => handleNote(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label><b>Begrip</b></Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic" style={{ color: 'black' }}>
                                {annotation?.term?.definition ? <>{annotation.term.definition}</> : <>
                                    Selecteer</>}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown">
                                {terms.map((term, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => handleTerm(term)}
                                        active={annotation?.term?.definition === term.definition}
                                        style={{ color: 'black' }}
                                    >
                                        {term.definition}
                                    </Dropdown.Item>
                                ))}
                                <Dropdown.Item onClick={() => setShowModal(true)}>Add New Term</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        {/* Render de relaties als knoppen */}
                        <div>
                            <Form.Label><b>Relaties</b></Form.Label>
                            <br />
                            <div className='relation-buttons'>
                                <p>Verplicht</p>
                                {relations.map(relation => (
                                    relation.cardinality.split("_")[0] === "V" ? (
                                        <Button key={relation.id} variant="secondary" className="me-1 text-dark">
                                            + {relation.description}
                                        </Button>
                                    ) : null
                                ))}
                            </div>
                            <div className='relation-buttons'>
                                <p>Optioneel</p>
                                {relations.map(relation => (
                                    relation.cardinality.split("_")[0] === "NV" ? (
                                        <Button key={relation.id} variant="secondary" className="me-1 text-dark">
                                            + {relation.description}
                                        </Button>
                                    ) : null
                                ))}
                            </div>
                        </div>
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Term</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter new term"
                                    value={newTerm.definition}
                                    onChange={(e) => setNewTerm({
                                        ...newTerm,
                                        definition: e.target.value,
                                        reference: annotation?.selectedWord
                                    })}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleAddTerm}>
                                    Add Term
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Form.Group>
                </Form>
            </div>

            <div className={`${css.buttonsRight}`}>
                <button className={`${css.save}`} onClick={handleSave}>
                    Opslaan
                </button>
                <button className={`${css.cancel}`} onClick={handleClose}>
                    Annuleer
                </button>
            </div>
        </>
    );
}

export default CreateAnnotation;
