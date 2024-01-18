"use client"; // This is a client component 👈🏽

import React, { FC, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import css from "./annotated-row.module.css";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { Annotation } from "@/app/models/annotation";
import { Term } from "@/app/models/term";
import { User } from "@/app/models/user";
import { LawClass } from "@/app/models/lawclass";
import { Relation } from "@/app/models/relation";

import { subscribe, unsubscribe } from "@/app/services/user";

interface AnnotationProps {
    annotation: Annotation;
    handleEdit: (annotation: Annotation, id: number) => void;
    handleDelete: (id: number) => void;
    open: boolean;
    relations?: Relation[]; // Add this line
}

const AnnotatedRow: FC<AnnotationProps> = ({ annotation, handleEdit, handleDelete, open }) => {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editLabelText, setEditLabelText] = useState(''); // text being edited
    const [editNoteText, setEditNoteText] = useState<string | undefined>(''); // text being edited
    const [editTerm, setEditTerm] = useState<Term | null>();

    const [updatedAnnotation, setUpdatedAnnotation] = useState<Annotation>(annotation);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [classes, setClasses] = useState<LawClass[]>([]); // New state to store the laws
    const [editLawClass, setEditLawClass] = useState<string | null>(null);
    const [subannotations, setSubannotations] = useState<Annotation[]>([]);

    // const [relations, setRelations] = useState<Relation>(null);

    const [terms, setTerms] = useState<Term[]>([]); // New state to store the laws
    const [newTerm, setNewTerm] = useState<Term>({
        id: 0,
        definition: "",
        reference: ""
    } as Term);

    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User>({
        id: 0,
        name: "",
        role: ""
    }
    );

    useEffect(() => {
        // Subscribe to changes in the selected user
        const handleUserChange = (user: User) => {
            // Handle the change in the component
            setCurrentUser(user);
        };

        subscribe(handleUserChange);

        // Unsubscribe when the component unmounts
        return () => {
            unsubscribe(handleUserChange);
        };
    }, []);

    const checkValues = () => {
        if (editLabelText.length !== 0) {
            setIsConfirmModalOpen(!isConfirmModalOpen);

            updatedAnnotation.selectedWord = editLabelText;
            updatedAnnotation.updated_at = Date.now();
            updatedAnnotation.updated_by = currentUser

            // Check if editNoteText is not null before assigning
            if (editNoteText != null) {
                updatedAnnotation.text = editNoteText;
            }

            if (editTerm?.definition != null) {
                updatedAnnotation.term = {
                    id: editTerm.id,
                    definition: editTerm.definition,
                    reference: editLabelText,
                    annotations: []
                };
            } else {
                updatedAnnotation.term = null;
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
            await setEditTerm(newTerm);
            updatedAnnotation.term = {
                id: newTerm.id,
                definition: newTerm.definition,
                reference: annotation.selectedWord,
                annotations: []
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

    const handleSelectLaw = async (lawClassName: any) => {
        try {
            // find lawclass in array
            const selectedLawClass = classes.find((lawClass) => lawClass.name === lawClassName);

            if (selectedLawClass) {
                const lawClassId = selectedLawClass.id;

                // fetch subannotations
                const subAnnotationsResponse = await fetch(`http://localhost:8000/api/annotations/children/${annotation.id}`);

                if (subAnnotationsResponse.ok) {
                    const childAnnotations = await subAnnotationsResponse.json();
                    console.log("childAnnotations", childAnnotations);
                    setEditLawClass(lawClassName ?? null);

                    if (childAnnotations.length > 0) {
                        // check subclasses from new class
                        const subclasses = await fetchSubclasses(selectedLawClass);

                        // Get the IDs of subannotations to be deleted
                        const annotationsToDelete = childAnnotations
                            .filter((childAnnotation: any) => childAnnotation.lawClassId !== lawClassId)
                            .map((childAnnotation: any) => childAnnotation.id);

                        // Delete subannotations
                        await Promise.all(
                            annotationsToDelete.map(async (annotationId: any) => {
                                try {
                                    const deleteAnnotationResponse = await fetch(
                                        `http://localhost:8000/api/annotations/deleteannotation/${annotationId}`,
                                        {
                                            method: 'DELETE',
                                        }
                                    );

                                    if (!deleteAnnotationResponse.ok) {
                                        console.error(
                                            'Failed to delete child annotation:',
                                            deleteAnnotationResponse.status,
                                            deleteAnnotationResponse.statusText
                                        );
                                    }
                                } catch (error) {
                                    console.error('Error deleting child annotation:', error);
                                }
                            })
                        );

                        // Now, update the law class for the remaining subannotations
                        const updatedSubAnnotations = childAnnotations.map((childAnnotation: any) => {
                            const childLawClass = classes.find((lawClass) => lawClass.id === childAnnotation.lawClassId);
                            const childLawClassName = childLawClass?.name;

                            if (!subclasses.includes(childLawClassName)) {
                                // Law class doesn't belong to the new class, set it to null
                                childAnnotation.lawClass = null;
                            } else {
                                // Law class belongs to the new class, update it
                                childAnnotation.lawClass = selectedLawClass;
                            }

                            return childAnnotation;
                        });

                        // update the updated subannotations
                        setSubannotations(updatedSubAnnotations);

                        console.log("Updated subannotations:", updatedSubAnnotations);
                    } else {
                        console.log("No child annotations found.");
                    }
                } else {
                    console.error(
                        'Failed to fetch subannotations:',
                        subAnnotationsResponse.status,
                        subAnnotationsResponse.statusText
                    );
                }
            }
        } catch (error) {
            console.error('Error updating subannotations:', error);
        }
    };



    const fetchSubclasses = async (lawClass: LawClass) => {
        try {
            const response = await fetch(`http://localhost:8000/api/relations/${lawClass.id}`);
            if (response.ok) {
                const subclasses = await response.json();
                return subclasses.map((subclass: any) => subclass.name);
            } else {
                console.error("Error fetching subclasses:", response.status, response.statusText);
                return [];
            }
        } catch (error) {
            console.error("Error in fetchSubclasses:", error);
            return [];
        }
    };

    // Update UI when annotation changes
    useEffect(() => {
        setEditLabelText(annotation.selectedWord)
        setEditNoteText(annotation.text)
        setEditTerm(annotation?.term)
        fetchTerms(annotation.selectedWord)
        fetchClasses();
    }, [annotation.selectedWord, annotation.text, annotation.term?.definition, annotation.lawClass]);

    // Set user on first render with localstorage
    useEffect(() => {

        const localString = localStorage.getItem("user")

        if (localString != null) {
            const localUser = JSON.parse(localString)
            setCurrentUser(localUser)
        }
    }, []);

    return (
        // Dropdown rechtsbetrekking
        <div>
            {open &&
                <div className={`${css.annotationInfo} ${isEditing ? css.editing : ''}`}>

                    <div className={css.iconRow}>
                        <FaEdit className={css.iconCol} id={"iconEdit"}
                            style={isEditing ? ({ display: "none" }) : ({ display: "block" })}
                            onClick={() => setIsEditing(true)} />
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
                                        {editTerm?.definition ? editTerm.definition : <>
                                            Selecteer</>}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown">
                                        <Dropdown.Item
                                            onClick={() => {
                                                setEditTerm(null)
                                            }}
                                            active={!editTerm}  // Highlight if no term is selected
                                            style={{ color: 'black' }}
                                        >
                                            Selecteer niets
                                        </Dropdown.Item>
                                        {terms.map((term, index) => (
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => setEditTerm(term)}
                                                active={editTerm?.definition === term.definition}
                                                style={{ color: 'black' }}
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
                            <h4 className={`${css.rightCol} ${css.annotationName} ${css.childAnnotation}`} style={{ background: annotation.parentAnnotation.lawClass?.color }}>{annotation.parentAnnotation.selectedWord}</h4>
                        </div>
                            : ""
                    }

                    {!isEditing &&
                        <span>
                            <p className={css.annotationDate}>
                                {annotation.updated_at ? 'veranderd' : 'aangemaakt'} op {new Date(annotation.updated_at ? annotation.updated_at : annotation.created_at).toLocaleString()} door {annotation.updated_at ? annotation.updated_by.name : annotation.created_by.name}
                            </p>
                        </span>
                    }

                    {isEditing &&
                        <div className={`${css.buttonsRight}`}>
                            <button className={`${css.save}`} onClick={() => setIsConfirmModalOpen(true)}>Opslaan</button>
                            <button className={`${css.cancel}`} onClick={() => setIsEditing(false)}>Annuleer</button>
                            <button className={`${css.delete}`} onClick={() => setIsDeleteModalOpen(true)}>Verwijderen</button>
                        </div>
                    }
                </div>
            }

            <Modal show={isConfirmModalOpen} onHide={() => { setIsConfirmModalOpen(!isConfirmModalOpen) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Wil je deze annotatie bijwerken?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="success" onClick={checkValues}>Ja</Button>
                </Modal.Body>
            </Modal>

            <Modal show={isDeleteModalOpen} onHide={() => { setIsDeleteModalOpen(!isDeleteModalOpen) }}>
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
