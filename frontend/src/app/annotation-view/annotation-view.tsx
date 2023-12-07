"use client"; // This is a client component 👈🏽

import React, {useEffect, useState} from "react";
import AnnotatedRow from "@/app/annotation-view/annotated-row/annotated-row";
import {Annotation} from "@/app/models/annotation";
import css from "./annotation-view.module.css"


const AnnotationView = () => {

    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchAnnotations = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/annotations/');

            if (response.ok) {
                const data = await response.json();
                setAnnotations(data);
            } else {
                console.error('Fout annotaties ophalen');
            }
        } catch (error) {
            console.error('Fout annotaties ophalen:', error);
        }
    };

    const handleEdit = async (annotationDetails: Annotation, id: number) => {
        try {
            const response= await fetch(`http://localhost:8000/api/annotations/updateannotation/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(annotationDetails)
            });


            console.log(response);
            if (response.ok) {
                alert('Annotatie succesvol bijgewerkt');
                fetchAnnotations(); // Refetch annotations
            } else {
                alert('Fout annotatie bijwerken');
            }
        } catch (error) {
            console.error('Fout annotatie bijwerken:', error);
            alert('Fout annotatie verwijderen');
        }
    };


    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/annotations/deleteannotation/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Annotatie succesvol verwijderd');
                fetchAnnotations(); // Refetch annotations to update the list
            } else {
                alert('Fout annotatie verwijderen');
            }
        } catch (error) {
            console.error('Fout annotatie verwijderen:', error);
            alert('Fout annotatie verwijderen');
        }
    }

    // Use useEffect to fetch annotations when the component mounts
    useEffect(() => {
        fetchAnnotations();
    }, []);

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
                        <AnnotatedRow annotation={value} handleEdit={handleEdit} handleDelete={handleDelete}/>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default AnnotationView