"use client"; // This is a client component 👈🏽

import React, {useEffect, useState} from "react";
import AnnotatedRow from "@/app/annotation-view/annotated-row/annotated-row";
import {Annotation} from "@/app/models/annotation";
import css from "./annotation-view.module.css"


const AnnotationView = () => {

    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [annotationData, setAnnotationData] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState(''); // text being edited
    const [isModalOpen, setIsModalOpen] = useState(false)


    const fetchAnnotations = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/annotations/');

            if (response.ok) {
                const data = await response.json();
                setAnnotations(data);
            } else {
                console.error('Error fetching annotations');
            }
        } catch (error) {
            console.error('Error fetching annotations:', error);
        }
    };

    // Use useEffect to fetch annotations when the component mounts
    useEffect(() => {
        fetchAnnotations();
    }, []);

    useEffect(() => {
        console.warn(annotations)
    }, [annotations]);


    return (
        <div>
            <div className={css.topBar}>
                <h2 className={css.title}>Annotaties</h2>

                <img className={css.image} src="/juridischanalyseschema.png" alt={"Juridisch Analyseschema"} onClick={() => {
                    setIsModalOpen(!isModalOpen)
                }}/>
            </div>

            {isModalOpen &&
                <div className={css.modalContainer} onClick={() => {
                    setIsModalOpen(!isModalOpen)
                }}>
                    <img className={css.imageModal} src="/juridischanalyseschema.png" alt={"Juridisch Analyseschema"}/>
                </div>
            }

            <div className={"annolist"}>
                {annotations && annotations.map((value, index) => (
                    <div className={css.annotatedRow} key={index}>
                        <AnnotatedRow annotation={value}/>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default AnnotationView