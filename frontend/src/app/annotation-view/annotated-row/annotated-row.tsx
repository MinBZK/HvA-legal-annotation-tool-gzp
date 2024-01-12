"use client"; // This is a client component 👈🏽

import React, {FC, useEffect, useState} from "react";
import {FaChevronDown, FaChevronUp, FaEdit} from "react-icons/fa";
import css from "./annotated-row.module.css";
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import {Annotation} from "@/app/models/annotation";
import {Term} from "@/app/models/term";
import {LawClass} from "@/app/models/lawclass";
import {Relation} from "@/app/models/relation";
// import fetchTerms from "@/app/annotations/create-annotation/create-annotation"

interface AnnotationProps {
    annotation: Annotation;
    handleEdit: (annotation: Annotation, id: number) => void;
    handleDelete: (id: number) => void;
}

const AnnotatedRow: FC<AnnotationProps> = ({ annotation, handleEdit, handleDelete }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editLabelText, setEditLabelText] = useState(''); // text being edited
    const [editNoteText, setEditNoteText] = useState<string | undefined>(''); // text being edited
    const [editTermText, setEditTermText] = useState<string | undefined>('');

    const [updatedAnnotation, setUpdatedAnnotation] = useState<Annotation>(annotation);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
    const [editLawClass, setEditLawClass] = useState<string | null>(null);

    const [terms, setTerms] = useState<Term[]>([]); // New state to store the laws
    const [newTerm, setNewTerm] = useState<Term>({
        id: 0,
        definition: "",
        reference: ""
    } as Term);

    const [showModal, setShowModal] = useState(false);

    const checkValues = () => {
        if (editLabelText.length !== 0) {
            setIsConfirmModalOpen(!isConfirmModalOpen);

            updatedAnnotation.selectedWord = editLabelText;

            // Check if editNoteText is not null before assigning
            if (editNoteText != null) {
                updatedAnnotation.text = editNoteText;
            }

            if (editTermText != null) {
                updatedAnnotation.term = {
                    id: updatedAnnotation.term ? updatedAnnotation.term.id : 0,
                    definition: editTermText,
                    reference: editLabelText,
                };
            }

            if(editLawClass != null) {
                updatedAnnotation.lawClass = classes.find(lawClass => lawClass.name === editLawClass);
            }

            setIsEditing(false);
            handleEdit(updatedAnnotation, annotation.id);
        } else {
            alert("Velden zijn leeg, vul deze in!");
        }
    };

    // Delete annotation with id
    const checkDelete = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen)
        setIsEditing(false)
        handleDelete(annotation.id)
    }

    const handleAddTerm = async () => {
        try {
            await setEditTermText(newTerm.definition);
            updatedAnnotation.term = {
                id: 0,
                definition: newTerm.definition,
                reference: annotation.selectedWord,
            };
            fetchTerms(annotation.selectedWord)
            setShowModal(false);
        } catch (error) {
            console.error('Error saving annotation:', error);
            return null;
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/classes");
            if (response.ok) {
                const fetchedClasses = await response.json();
                setClasses(fetchedClasses);
            } else {
                console.error("Error fetching law classes");
            }
        } catch (error) {
            console.error("Error fetching law classes:", error);
        }
    };

    const fetchTerms = (reference: any) => {
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

    const handleSelectLaw = async (lawClassName: any) => {
        const selectedLawClass = classes.find((lawClass) => lawClass.name === lawClassName);

        if (selectedLawClass) {
            setEditLawClass(lawClassName ?? null);
        }

        if (isEditing) {
            try {
                // Fetch existing subannotations for the annotation's current law class
                const existingSubannotationsResponse = await fetch(`http://localhost:8000/api/annotations/subannotations/${annotation.id}`);

                if (existingSubannotationsResponse.ok) {
                    const existingSubannotations = await existingSubannotationsResponse.json();

                    // Update or delete existing subannotations
                    const outdatedSubannotationsIds: number[] = []; // Store IDs of outdated subannotations

                    for (const subannotation of existingSubannotations) {
                        const updatedSubannotation = { ...subannotation, lawClassId: selectedLawClass?.id };
                        const updateSubannotationResponse = await fetch(
                            `http://localhost:8000/api/annotations/subannotations/${subannotation.id}`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(updatedSubannotation),
                            }
                        );

                        if (!updateSubannotationResponse.ok) {
                            console.error(
                                'Failed to update subannotation:',
                                updateSubannotationResponse.status,
                                updateSubannotationResponse.statusText
                            );
                        } else {
                            // Store ID of updated subannotation
                            outdatedSubannotationsIds.push(subannotation.id);
                        }
                    }

                    // Update the annotation state after changing the law class
                    const updatedAnnotationState = {
                        ...annotation,
                        lawClass: selectedLawClass, // Update the law class
                    };
                    setUpdatedAnnotation(updatedAnnotationState);

                    // Declare and initialize newSubannotations
                    const newSubannotations: Annotation[] = []; // Replace this with the logic to generate new subannotations

                    // If there are new subannotations for the updated law class, create them
                    for (const newSubannotation of newSubannotations) {
                        const createSubannotationResponse = await fetch(
                            `http://localhost:8000/api/annotations/subannotations`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...newSubannotation,
                                    annotationId: annotation.id,
                                    lawClassId: selectedLawClass?.id,
                                }),
                            }
                        );

                        if (!createSubannotationResponse.ok) {
                            console.error(
                                'Failed to create new subannotation:',
                                createSubannotationResponse.status,
                                createSubannotationResponse.statusText
                            );
                        }
                    }

                    // Delete outdated subannotations (related to the old law class)
                    for (const outdatedSubannotationId of outdatedSubannotationsIds) {
                        const deleteSubannotationResponse = await fetch(
                            `http://localhost:8000/api/annotations/subannotations/${outdatedSubannotationId}`,
                            {
                                method: 'DELETE',
                            }
                        );

                        if (!deleteSubannotationResponse.ok) {
                            console.error(
                                'Failed to delete outdated subannotation:',
                                deleteSubannotationResponse.status,
                                deleteSubannotationResponse.statusText
                            );
                        }
                    }
                    setOpen(true);
                } else {
                    console.error(
                        'Failed to fetch existing subannotations:',
                        existingSubannotationsResponse.status,
                        existingSubannotationsResponse.statusText
                    );
                }
            } catch (error) {
                console.error('Error updating subannotations:', error);
            }
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (annotation.selectedWord) {
            fetchTerms(annotation.selectedWord);
        }
    }, [annotation.selectedWord]);


    // Update UI when annotation changes
    useEffect(() => {
        setEditLabelText(annotation.selectedWord)
        setEditNoteText(annotation.text)
        setEditTermText(annotation?.term?.definition)
        setEditLawClass(annotation.lawClass?.name ?? null);
        setUpdatedAnnotation(annotation);
        // fetchTerms(annotation.selectedWord)
        // fetchClasses();
    }, [annotation.selectedWord, annotation.text, annotation.term?.definition, annotation.lawClass]);

    return (
        // Dropdown rechtsbetrekking
        <div>
            <div className={css.annotationTitle} style={{ background: annotation.lawClass?.color }} onClick={() => {
                ``
                setOpen(!open)
            }}>
                <h5 className={css.annotationName}>{annotation.lawClass?.name}</h5>
                {open ? (
                    <FaChevronDown className={css.align} />
                ) : (
                    <FaChevronUp />
                )}
            </div>

            {open &&
                <div className={css.annotationInfo}>

                    <div className={css.iconRow}>
                        <FaEdit className={css.iconCol} id={"iconEdit"}
                                style={isEditing ? ({display: "none"}) : ({display: "block"})}
                                onClick={() => setIsEditing(true)}/>
                    </div>

                    {/*law class dropdown*/}
                    <div className={css.row}>
                        <h4 className={`${css.leftCol} ${css.annotationName}`}>Wetvorm</h4>
                        {isEditing ? (
                            <Dropdown>
                                <Dropdown.Toggle
                                    className="dropdown" variant="secondary" id="dropdown-basic"
                                    style={{
                                        color: 'black',
                                        backgroundColor: editLawClass
                                            ? classes.find(law => law.name === editLawClass)?.color || ''
                                            : '',
                                    }}
                                >
                                    {editLawClass ? <>{editLawClass}</> : <>Selecteer</>}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown">
                                    {classes.map((law, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => handleSelectLaw(law.name)}
                                            active={editLawClass === law.name}
                                            style={{ backgroundColor: law.color, color: 'black' }}
                                        >
                                            {law.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <h4 className={`${css.rightCol} ${css.annotationName}`}>{annotation?.lawClass?.name}</h4>
                        )}

                    </div>

                    <div className={css.row}>
                        <h4 className={`${css.leftCol} ${css.annotationName}`}>Label</h4>
                        {isEditing ? (
                            <Form.Control
                                as="textarea"
                                value={editLabelText}
                                onChange={(event) => {
                                    setEditLabelText(event.target.value)
                                }}
                            />
                        ) : (
                            <h4 className={`${css.rightCol} ${css.annotationName}`}>{annotation.selectedWord}</h4>
                        )}
                    </div>

                    <div className={css.row}>
                        <h4 className={`${css.leftCol} ${css.annotationName}`}>Notitie</h4>

                        {isEditing ? (
                            <Form.Control
                                className={""}
                                as="textarea"
                                value={editNoteText}
                                onChange={(event) => {
                                    setEditNoteText(event.target.value)
                                }}
                            />
                        ) : (
                            <h4 className={`${css.rightCol} ${css.annotationName}`}>{annotation.text}</h4>
                        )}
                    </div>
                    <div className={css.row}>
                        <h4 className={`${css.leftCol} ${css.annotationName}`}>Begrip</h4>
                        {isEditing ? (
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Dropdown>
                                    <Dropdown.Toggle className="dropdown" variant="secondary" id="dropdown-basic">
                                        {editTermText ? editTermText : <>
                                            Selecteer</>}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown">
                                        <Dropdown.Item
                                            onClick={() => setEditTermText("")}
                                            active={!editTermText}  // Highlight if no term is selected
                                            style={{color: 'black'}}
                                        >
                                            Selecteer niets
                                        </Dropdown.Item>
                                        {terms.map((term, index) => (
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => setEditTermText(term.definition)}
                                                active={editTermText === term.definition}
                                                style={{color: 'black'}}
                                            >
                                                {term.definition}
                                            </Dropdown.Item>
                                        ))}
                                        <Dropdown.Item onClick={() => setShowModal(true)}>Add New Term</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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
                        ) : (
                            <h4 className={`${css.rightCol} ${css.annotationName}`}>{annotation.term?.definition}</h4>
                        )}
                    </div>

                    {
                        annotation.parentAnnotation != null ? <div className={css.row}>
                                <h4 className={`${css.leftCol} ${css.annotationName}`}>Onderdeel van</h4>
                                <h4 className={`${css.rightCol} ${css.annotationName} ${css.childAnnotation}`}
                                    style={{background: annotation.parentAnnotation.lawClass?.color}}>{annotation.parentAnnotation.selectedWord}</h4>
                            </div>
                            : ""
                    }

                    {isEditing &&
                        <div className={`${css.buttonsRight}`}>
                            <button className={`${css.save}`} onClick={() => setIsConfirmModalOpen(true)}>Opslaan
                            </button>
                            <button className={`${css.cancel}`} onClick={() => setIsEditing(false)}>Annuleer</button>
                            <button className={`${css.delete}`} onClick={() => setIsDeleteModalOpen(true)}>Verwijderen
                            </button>
                        </div>
                    }
                </div>
            }

            <Modal show={isConfirmModalOpen} onHide={() => {
                setIsConfirmModalOpen(!isConfirmModalOpen)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Wil je deze annotatie bijwerken?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="success" onClick={checkValues}>Ja</Button>
                </Modal.Body>
            </Modal>

            <Modal show={isDeleteModalOpen} onHide={() => {
                setIsDeleteModalOpen(!isDeleteModalOpen)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Wil je deze annotatie verwijderen?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="success" onClick={checkDelete}>Ja</Button>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default AnnotatedRow
