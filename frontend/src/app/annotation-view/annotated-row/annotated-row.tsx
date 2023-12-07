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
        // check is input aren't empty
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

    const checkDelete = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen)
        setIsEditing(false)
        handleDelete(annotation.id)
    }


    useEffect(() => {
        setEditLabelText(annotation.selectedWord)
        setEditNoteText(annotation.text)
    }, []);

    return (
        <div>
            <div className={css.annotationTitle} style={{background: annotation.lawClass.color}} onClick={() => {
                setOpen(!open)
            }}>
                <h5>{annotation.lawClass.name}</h5>

                {open ? (
                    <FaChevronDown className={css.align}/>
                ) : (
                    <FaChevronUp/>
                )}
            </div>

            {open &&
                <div className={css.annotationInfo}>
                    <div className={css.row}>
                        <h4 className={css.leftCol}>Label</h4>
                        {isEditing ? (
                            <Form.Control
                                as="textarea"
                                value={editLabelText}
                                onChange={(event) => {
                                    setEditLabelText(event.target.value)
                                }}
                            />
                        ) : (
                            <h4 className={css.rightCol}>{annotation.selectedWord}</h4>
                        )}
                        <FaEdit className={css.iconCol} onClick={() => setIsEditing(!isEditing)}/>
                    </div>

                    <div className={css.row}>
                        <h4 className={css.leftCol}>Notitie</h4>

                        {isEditing ? (
                            <Form.Control
                                as="textarea"
                                value={editNoteText}
                                onChange={(event) => {
                                    setEditNoteText(event.target.value)
                                }}
                            />
                        ) : (
                            <h4 className={css.rightCol}>{annotation.text}</h4>
                        )}
                    </div>
                    <div className={css.row}>
                        <h4 className={css.leftCol}>Begrip</h4>
                        <h4 className={css.rightCol}>{}</h4>
                    </div>

                    {isEditing &&
                        <>
                            <Button variant="success" onClick={() => setIsConfirmModalOpen(true)}>Opslaan</Button>
                            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Verwijderen</Button>
                        </>
                    }
                </div>
            }

            <Modal show={isConfirmModalOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Wil je deze annotatie bijwerken?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="success" onClick={checkValues}>Ja</Button>
                    <Button variant="danger" onClick={() => setIsConfirmModalOpen(!isConfirmModalOpen)}>Nee</Button>
                </Modal.Body>
            </Modal>

            <Modal show={isDeleteModalOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Wil je deze annotatie verwijderen?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="success" onClick={checkDelete}>Ja</Button>
                    <Button variant="danger" onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}>Nee</Button>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default AnnotatedRow