"use client"; // This is a client component 👈🏽

import React, {FC, useEffect, useState} from "react";
import {FaChevronDown} from "react-icons/fa";
import {FaChevronUp} from "react-icons/fa";
import {FaEdit} from "react-icons/fa";
import css from "./annotated-row.module.css";
import {Button, Form} from "react-bootstrap";
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


    const checkValues = () => {
        // check is input aren't empty
        if (editLabelText.length != 0 && editNoteText.length != 0) {
            updatedAnnotation.selectedWord = editLabelText
            updatedAnnotation.text = editNoteText

            const confirmModal = confirm("Wil je deze annotatie bijwerken?")

            if (confirmModal) {
                setIsEditing(false)
                handleEdit(updatedAnnotation, annotation.id)
            }
        } else {
            alert("Velden zijn leeg, vul deze in!")
        }
    }

    const checkDelete = () => {
        const deleteModal = confirm("Wil je deze annotatie verwijderen?")

        if (deleteModal) {
            setIsEditing(false)
            handleDelete(annotation.id)
        }
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
                        <FaEdit className={css.iconCol} onClick={() => setIsEditing(true)}/>
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
                            <Button variant="success" onClick={() => checkValues()}>Save</Button>
                            <Button variant="danger" onClick={() => checkDelete()}>Delete</Button>
                        </>
                    }
                </div>
            }
        </div>
    )
}

export default AnnotatedRow