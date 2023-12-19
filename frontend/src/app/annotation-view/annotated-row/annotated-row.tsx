"use client"; // This is a client component 👈🏽

import React, {FC, useEffect, useState} from "react";
import {FaChevronDown} from "react-icons/fa";
import {FaChevronUp} from "react-icons/fa";
import {FaEdit} from "react-icons/fa";
import css from "./annotated-row.module.css";
import {Button, Form, Modal} from "react-bootstrap";
import {Annotation} from "@/app/models/annotation";

interface AnnotatationProps {
    annotation: Annotation
    handleEdit: (annotation: Annotation, id: number) => void
    handleDelete: (id: number) => void
}

const AnnotatedRow: FC<AnnotatationProps> = ({annotation, handleEdit, handleDelete}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editLabelText, setEditLabelText] = useState(''); // text being edited
    const [editNoteText, setEditNoteText] = useState(''); // text being edited
    const [updatedAnnotation, setUpdatedAnnotation] = useState<Annotation>(annotation);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);


    const checkValues = () => {
        // check is input aren't empty (label and notitie)
        if (editLabelText.length != 0 && editNoteText.length != 0) {
            setIsConfirmModalOpen(!isConfirmModalOpen)

            updatedAnnotation.selectedWord = editLabelText
            updatedAnnotation.text = editNoteText

            setIsEditing(false)
            handleEdit(updatedAnnotation, annotation.id)
        } else {
            alert("Velden zijn leeg, vul deze in!")
        }
    }


    // Delete annotation with id
    const checkDelete = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen)
        setIsEditing(false)
        handleDelete(annotation.id)
    }

    // Update UI when annotation changes
    useEffect(() => {
        setEditLabelText(annotation.selectedWord)
        setEditNoteText(annotation.text)
    }, [annotation.selectedWord, annotation.text]);

    return (
        // Dropdown rechtsbetrekking
        <div>
            <div className={css.annotationTitle} style={{background: annotation.lawClass.color}} onClick={() => {``
                setOpen(!open)
            }}>
                <h5 className={css.annotationName}>{annotation.lawClass.name}</h5>
                {open ? (
                    <FaChevronDown className={css.align}/>
                ) : (
                    <FaChevronUp/>
                )}
            </div>

            {open &&
                <div className={css.annotationInfo}>

                    <div className={css.iconRow}>
                        <FaEdit className={css.iconCol} id={"iconEdit"}
                                style={isEditing ? ({display: "none"}) : ({display: "block"})}
                                onClick={() => setIsEditing(true)}/>
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
                        <h4 className={`${css.rightCol} ${css.annotationName}`}>{}</h4>
                    </div>

                    {isEditing &&
                        <div className={`${css.buttonsRight}`}>
                            <button className={`${css.save}`} onClick={() => setIsConfirmModalOpen(true)}>Opslaan</button>
                            <button className={`${css.cancel}`} onClick={() => setIsEditing(false)}>Annureer</button>
                            <button className={`${css.delete}`} onClick={() => setIsDeleteModalOpen(true)}>Verwijderen</button>
                        </div>
                    }
                </div>
            }

            <Modal show={isConfirmModalOpen} onHide={() => {setIsConfirmModalOpen(!isConfirmModalOpen)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Wil je deze annotatie bijwerken?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button  variant="success" onClick={checkValues}>Ja</Button>
                </Modal.Body>
            </Modal>

            <Modal show={isDeleteModalOpen} onHide={() => {setIsDeleteModalOpen(!isDeleteModalOpen)}}>
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
