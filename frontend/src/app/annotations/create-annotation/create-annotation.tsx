'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { FC, useEffect, useState } from 'react';
import { Alert, Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { BsFillFloppy2Fill, BsX, BsCheck2Square } from "react-icons/bs";
import { Annotation } from "../../models/annotation";
import { LawClass } from "../../models/lawclass";
import { getProjectById } from "../../services/project";
import { Project } from "../../models/project";
import "./create-annotation.css"
import css from "../../annotation-view/annotated-row/annotated-row.module.css"
import { Term } from "@/app/models/term";
import { Relation } from "@/app/models/relation";
import { User } from "@/app/models/user";
import { getChildAnnotationsFromParentId } from '@/app/services/annotation';

interface PopupProps {
    selectedText1: any,
    selectedText2: any,
    tempId1: any,
    tempId2: any,
    onSetActiveSelection: (selection: number) => void;
    onClose: () => void; // Callback to indicate closing
    onAnnotationSaved: () => void; // Callback to indicate closing
    currentUser: User,
    addRelation: any;
    cancel: any;
}

const CreateAnnotation: FC<PopupProps> = ({ selectedText1,
    selectedText2,
    tempId1,
    tempId2,
    onSetActiveSelection, onClose, onAnnotationSaved, currentUser,
    addRelation,
    cancel
}) => {

    const [projectId, setProjectId] = useState<number>(0);
    const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
    const [terms, setTerms] = useState<Term[]>([]); // New state to store the laws
    const [relations, setRelations] = useState<Relation[]>([]); // State voor het opslaan van relaties
    const [showSubAnnotationForm, setShowSubAnnotationForm] = useState(false);
    const [parentAnnotationTagsExists, setParentAnnotationTagsExists] = useState(false)
    const [subAnnotationDetails, setSubAnnotationDetails] = useState<Annotation>({
        id: 0,
        text: "",
        selectedWord: "",
        lawClass: undefined,
        project: { id: 0 },
        tempId: 0,
        term: { definition: "", reference: "" },
        parentAnnotation: null,
        relation: null
    } as unknown as Annotation);

    const [newTerm, setNewTerm] = useState<Term>({
        id: 0,
        definition: "",
        reference: ""
    } as Term);

    const [subNewTerm, setSubNewTerm] = useState<Term>({
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
        tempId: 0,
        term: { definition: "", reference: "" },
        parentAnnotation: null,
        relation: null
    } as unknown as Annotation);
    const [showModal, setShowModal] = useState(false);
    const [showSubModal, setSubShowModal] = useState(false);
    const [mainAnnotationSaved, setMainAnnotationSaved] = useState(null);
    const [existingChildren, setExistingChildren] = useState<number[]>([]);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showInputWarningModal, setShowInputWarningModal] = useState(false);

    useEffect(() => {
        fetchId();
        fetchClasses();
        handleSelectedText(selectedText1, tempId1);
        handleSelectedText2(selectedText2, tempId2);
        fetchTerms(selectedText1);
    }, [selectedText1, tempId1, selectedText2, tempId2]);


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
    // visibility van de sub annotation form
    const handleShowSubAnnotationForm = () => {
        onSetActiveSelection(2);
        setShowSubAnnotationForm(true);
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

    const handleSubTerm = (term: any) => {
        setSubAnnotationDetails((prevAnnotation) => ({
            ...(prevAnnotation as Annotation),
            term: term,
        }));
    };

    const handleSelectedText = (text: string, tempId: number) => {
        setAnnotation((prevAnnotation) => ({
            ...(prevAnnotation as Annotation),
            selectedWord: text,
            tempId: tempId,
        }));
    };

    const handleSelectedText2 = (text: string, tempId: number) => {
        setSubAnnotationDetails((prevAnnotation) => ({
            ...(prevAnnotation as Annotation),
            selectedWord: text,
            tempId: tempId,
        }));
    };

    const fetchClasses = () => {
        fetch(`${process.env.API_URL}/classes`)
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
        fetch(`${process.env.API_URL}/terms/${encodeURIComponent(reference)}`)
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
            setShowModal(false)
        } catch (error) {
            console.error('Error saving annotation:', error);
            return null;
        }
    };

    const handleAddSubTerm = async () => {
        try {
            await handleSubTerm(subNewTerm);
            setSubShowModal(false)
        } catch (error) {
            console.error('Error saving annotation:', error);
            return null;
        }
    };

    const handleClose = () => {
        setSubAnnotationDetails({
            id: 0,
            text: "",
            selectedWord: "",
            lawClass: undefined,
            project: { id: 0 },
            tempId: 0,
            term: { definition: "", reference: "" },
            parentAnnotation: null,
            relation: null
        } as unknown as Annotation);
    };

    const handleFinish = (cancel: boolean) => {
        const mandatoryRelations = relations.filter(relation => relation.cardinality.split("_")[0] === "V");

        const areAllMandatoryRelationshipsMade = mandatoryRelations.every(relation => {
            return existingChildren.includes(relation.id);
        });

        if ((!areAllMandatoryRelationshipsMade || existingChildren.length < mandatoryRelations.length) && !cancel) {
            setShowWarningModal(true);
            return;
        }

        setParentAnnotationTagsExists(false)

        addRelation();
        setLawClassError(false);
        setExistingChildren([]);
        onClose();
    };

    const saveAnnotationToBackend = async (backendAnnotation: any) => {
        try {
            const response = await fetch(`${process.env.API_URL}/annotations/`, {
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

            return responseData;
        } catch (error) {
            console.error('Error saving annotation:', error);
            return null;
        }
    };

    /**
     * Updates the XML content with new annotation tags based on the users selection.
     * Sends the updated XML content to the backend server to be saved.
     */
    const updateXMLInDatabase = async () => {
        try {
            // Create a copy of Project to avoid mutating the original object
            const updatedProject = {
                ...project,
            };

            const response = await fetch(`${process.env.API_URL}/saveXml`, {
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
        } catch (error) {
            console.error('Error updating XML:', error);
        }
    };

    /**
     * Handles the save button click.
     * Saves the annotation to the backend and adds the annotation tags to the XML content.
     */
    const handleSave = async () => {
        if (!annotation?.lawClass) {
            setLawClassError(true);
            return;
        }
        setLawClassError(false);

        // Save or retrieve the main annotation
        let mainAnnotation;

        if (mainAnnotationSaved) {
            mainAnnotation = mainAnnotationSaved;
        } else {
            mainAnnotation = await saveAnnotationToBackend({
                id: null,
                selectedWord: annotation?.selectedWord,
                text: annotation?.text,
                lawClass: { name: annotation?.lawClass },
                project: { id: projectId },
                term: { definition: annotation?.term?.definition || null, reference: annotation?.selectedWord },
                parentAnnotation: null,
                relation: null,
                created_at: Date.now(),
                created_by: currentUser
            });
            if (mainAnnotation) {
                // Set mainAnnotationSaved to avoid saving it again
                setMainAnnotationSaved(mainAnnotation);
            } else {
                console.error('Failed to save main annotation');
                return;
            }
        }

        if (!parentAnnotationTagsExists) {
            if (annotation?.selectedWord && typeof annotation.tempId === 'number') {
                annotateSelectedText(annotation.selectedWord, mainAnnotation.id, annotation.tempId);
                await updateXMLInDatabase();

                setParentAnnotationTagsExists(true)
                // Trigger the callback to re-render LoadXML
                onAnnotationSaved();
            } else {
                console.error('Annotation properties are not properly defined');
            }
        }

        if (showSubAnnotationForm) {
            // Save the sub-annotation
            const subAnnotation = await saveAnnotationToBackend({
                id: null,
                selectedWord: subAnnotationDetails?.selectedWord,
                text: subAnnotationDetails?.text,
                lawClass: { name: subAnnotationDetails?.lawClass?.name },
                project: { id: projectId },
                term: {
                    definition: subAnnotationDetails?.term?.definition || null,
                    reference: subAnnotationDetails?.selectedWord
                },
                parentAnnotation: mainAnnotation,
                relation: subAnnotationDetails.relation,
                created_at: Date.now(),
                created_by: currentUser
            });

            if (!subAnnotation) {
                console.error('Failed to save sub-annotation');
            }

            if (subAnnotationDetails?.selectedWord && typeof subAnnotationDetails.tempId === 'number') {
                annotateSelectedText(subAnnotationDetails.selectedWord, subAnnotation.id, subAnnotationDetails.tempId);
                await updateXMLInDatabase();

                // Trigger the callback to re-render LoadXML
                onAnnotationSaved();
                setShowSubAnnotationForm(false);

            } else {
                console.error('Annotation properties are not properly defined');
            }

        }
        await fetchExistingChildren(mainAnnotation);

        handleClose();

    };


    /**
     * Adds annotation tags to the XML content based on the users selection.
     *
     * @param selectedText
     * @param annotationId
     * @param tempId
     * @param definition
     */
    const annotateSelectedText = (selectedText: string, annotationId: number, tempId: number) => {
        const annotation = document.createElement('annotation');
        annotation.setAttribute('id', `${annotationId}`);

        const tempAnnotation = document.getElementById(`${tempId}`);
        if (tempAnnotation) {
            annotation.innerHTML = tempAnnotation.innerHTML;

            tempAnnotation?.parentNode?.replaceChild(annotation, tempAnnotation);

            project.xml_content = new XMLSerializer().serializeToString(document.getElementsByClassName('xml-content')[0]);
        }
    };

    const fetchRelationsForLawClass = async (lawClassId: number) => {
        try {
            const response = await fetch(`${process.env.API_URL}/relations/${lawClassId}`);
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

    const handleSelectSubLaw = async (lawClassId: number) => {
        try {
            const response = await fetch(`${process.env.API_URL}/lawclasses/${lawClassId}`);
            if (response.ok) {
                const fetchedLawclass = await response.json();
                setSubAnnotationDetails((prevAnnotation) => ({
                    ...(prevAnnotation as Annotation),
                    lawClass: fetchedLawclass,
                }));
            } else {
                console.error("Error fetching relations");
            }
        } catch (error) {
            console.error("Error fetching relations:", error);
        }
    }

    // This function updates the state of the subAnnotationDetails when the user types in the form
    const handleSubAnnotationDetailChange = (field: any, value: any) => {
        setSubAnnotationDetails(prevDetails => ({
            ...prevDetails,
            [field]: value
        }));
    };

    const fetchExistingChildren = async (mainAnnotation: any) => {
        try {
            const children = await getChildAnnotationsFromParentId(mainAnnotation.id);
            if (children.length > 0) {
                // Check if any child has the same law class ID as the sub-law class ID
                const existingChildrenIds = children.map((child: any) => child.relation.id);
                setExistingChildren(existingChildrenIds);
            }
        } catch (error) {
            console.error("Error fetching subs:", error);
        }
    };

    const checkInputFields = () => {
        if (subAnnotationDetails.lawClass || subAnnotationDetails.selectedWord != "" || subAnnotationDetails.text != "") {
            // Show an alert, warning, or handle the validation error accordingly
            setShowInputWarningModal(true);
            return;
        }
        if (!showSubAnnotationForm) {
            if (annotation.lawClass || annotation.selectedWord != "" || annotation.text != "") {
                // Show an alert, warning, or handle the validation error accordingly
                setShowInputWarningModal(true);
                return;
            }
        }

        onClose();
    }

    return (
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
                        <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic"
                            style={{
                                color: 'black',
                                backgroundColor: annotation?.lawClass
                                    ? (classes.find(law => law.name === annotation.lawClass?.toString()) || {}).color || ''
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
                                    style={{ backgroundColor: law.color, color: 'black' }}>
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
                            {annotation?.term?.definition ? <>{annotation.term.definition}</> : <>Selecteer</>}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown">
                            {terms.map((term, index) => (
                                <Dropdown.Item
                                    key={index}
                                    onClick={() => handleTerm(term)}
                                    active={annotation?.term?.definition === term.definition}
                                    style={{ color: 'black' }}>
                                    {term.definition}
                                </Dropdown.Item>
                            ))}
                            <Dropdown.Item onClick={() => setShowModal(true)}>Voeg nieuw begrip toe</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Voeg nieuw begrip toe</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                                as="textarea"
                                placeholder="Vul begrip in"
                                value={newTerm.definition}
                                onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value, reference: annotation?.selectedWord })}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { setShowModal(false); }}>
                                Annuleer
                            </Button>
                            <Button variant="primary" onClick={handleAddTerm}>
                                Voeg begrip toe
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Render de relaties als knoppen */}
                    {
                        parentAnnotationTagsExists &&
                        <div>
                            <Form.Label><b>Relaties</b></Form.Label>
                            <br />

                            {/* Verplicht Relations */}
                            <div className='relation-buttons'>
                                <p>Verplicht</p>
                                {relations.map(relation => {
                                    const isExisting = existingChildren.includes(relation.id);
                                    const buttonStyle = { backgroundColor: isExisting ? 'custom-primary' : 'custom-secondary' };

                                    return relation.cardinality.split("_")[0] === "V" && (
                                        <Button key={relation.id}
                                            // style={buttonStyle}
                                            className={`me-1 text-dark ${buttonStyle.backgroundColor}`}
                                            onClick={() => {
                                                handleShowSubAnnotationForm(); // Show the sub-annotation form
                                                handleSelectSubLaw(relation.subClass.id);
                                                handleSubAnnotationDetailChange('relation', relation)
                                                addRelation();
                                            }}>
                                            + {relation.description}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Optioneel Relations */}
                            <div className='relation-buttons'>
                                <p>Optioneel</p>
                                {relations.map(relation => {
                                    const isExisting = existingChildren.includes(relation.id);
                                    const buttonStyle = { backgroundColor: isExisting ? 'custom-primary' : 'custom-secondary' };

                                    return relation.cardinality.split("_")[0] === "NV" && (
                                        <Button key={relation.id}
                                            className={`me-1 text-dark ${buttonStyle.backgroundColor}`}
                                            onClick={() => {
                                                handleShowSubAnnotationForm(); // Show the sub-annotation form
                                                handleSelectSubLaw(relation.subClass.id)
                                                handleSubAnnotationDetailChange('relation', relation)
                                                addRelation()
                                            }}>
                                            + {relation.description}
                                        </Button>
                                    );
                                })}
                            </div>

                            {showSubAnnotationForm && (
                                <>
                                    {/* Close button for the Sub-Annotation Form */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Form.Label style={{
                                            textAlign: 'left', fontSize: '20px',
                                            display: 'block',
                                            marginBottom: '10px',
                                            fontWeight: 'bold',
                                            color: '#154273'
                                        }}>Juridische subklasse: {subAnnotationDetails.lawClass?.name}</Form.Label>
                                        <Button style={{ marginBottom: '10px' }} variant="outline-secondary" onClick={() => { setShowSubAnnotationForm(false); onSetActiveSelection(1); handleSelectedText2("", 0); handleClose() }} >
                                            X
                                        </Button>
                                    </div>
                                    <Form.Group>
                                        <Form.Label>Label</Form.Label>
                                        <Form.Control
                                            type="text" readOnly
                                            value={subAnnotationDetails.selectedWord}
                                            onChange={(e) => handleSubAnnotationDetailChange('selectedWord', e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Notitie</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={subAnnotationDetails.text}
                                            onChange={(e) => handleSubAnnotationDetailChange('text', e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label><b>Begrip</b></Form.Label>
                                        <Dropdown>
                                            <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic" style={{ color: 'black' }}>
                                                {subAnnotationDetails?.term?.definition ? <>{subAnnotationDetails.term.definition}</> : <>Selecteer</>}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="dropdown">
                                                {terms.map((term, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() => handleTerm(term)}
                                                        active={subAnnotationDetails?.term?.definition === term.definition}
                                                        style={{ color: 'black' }}>
                                                        {term.definition}
                                                    </Dropdown.Item>
                                                ))}
                                                <Dropdown.Item onClick={() => setSubShowModal(true)}>Voeg nieuw begrip toe</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </>
                            )}
                        </div>
                    }

                    <Modal show={showSubModal} onHide={() => setSubShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Voeg nieuw begrip toe</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                                as="textarea"
                                placeholder="Vul begrip in"
                                value={subNewTerm.definition}
                                onChange={(e) => setSubNewTerm({ ...subNewTerm, definition: e.target.value, reference: subAnnotationDetails?.selectedWord })}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setSubShowModal(false)}>
                                Annuleer
                            </Button>
                            <Button variant="primary" onClick={handleAddSubTerm}>
                                Voeg begrip toe
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form.Group>
            </Form>

            <div className={`${css.buttonsRight}`}>
                <button className={`${css.save}`} onClick={handleSave}>
                    <BsFillFloppy2Fill size={20} /> Opslaan
                </button>
                <button className={`${css.cancel}`} onClick={() => { handleFinish(true); cancel() }}>
                    <BsX size={20} /> Annuleer
                </button>
                {
                    parentAnnotationTagsExists && <button className={`${css.save}`} onClick={() => handleFinish(false)}>
                        <BsCheck2Square size={20} /> Afronden
                    </button>
                }
            </div>

            <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>U heeft niet alle verplichte relaties gelegd</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Weet u zeker dat u de annotaties wil opslaan zonder alle verplichte relaties te leggen?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowWarningModal(false); checkInputFields() }}>
                        Annuleer
                    </Button>
                    <Button variant="primary" onClick={() => { setShowWarningModal(false); checkInputFields() }}>
                        Ja
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showInputWarningModal} onHide={() => setShowInputWarningModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>U heeft nog ingevulde velden</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Weet u zeker dat u wil afronden zonder de ingevulde velden op te slaan?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInputWarningModal(false)}>
                        Annuleer
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setShowInputWarningModal(false); handleClose(); onClose();
                    }}>
                        Ja
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default CreateAnnotation;
