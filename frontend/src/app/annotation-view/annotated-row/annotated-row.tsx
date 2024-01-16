"use client"; // This is a client component 👈🏽

import React, { FC, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import css from "./annotated-row.module.css";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { Annotation } from "@/app/models/annotation";
import { Term } from "@/app/models/term";

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
    const [editTerm, setEditTerm] = useState<Term | null>();

    const [updatedAnnotation, setUpdatedAnnotation] = useState<Annotation>(annotation);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

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

    // Update UI when annotation changes
    useEffect(() => {
        setEditLabelText(annotation.selectedWord)
        setEditNoteText(annotation.text)
        setEditTerm(annotation?.term)
        fetchTerms(annotation.selectedWord)
    }, [annotation.selectedWord, annotation.text, annotation.term?.definition]);

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
                            style={isEditing ? ({ display: "none" }) : ({ display: "block" })}
                            onClick={() => setIsEditing(true)} />
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
