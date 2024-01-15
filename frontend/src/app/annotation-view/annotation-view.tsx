"use client"; // This is a client component 👈🏽

import React, {FC, useEffect, useState } from "react";
import AnnotatedRow from "@/app/annotation-view/annotated-row/annotated-row";
import { Annotation } from "@/app/models/annotation";
import css from "./annotation-view.module.css";
import Image from "next/image"

interface AnnotationViewProps {
    onAnnotationDelete: (annotationId: number) => void;
}

const AnnotationView: FC<AnnotationViewProps> = ({onAnnotationDelete}) => {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAnnotations = async (projectId: any) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/annotations/project/${projectId}`
            );

            if (response.ok) {
                const data = await response.json();
                setAnnotations(data);
            } else {
                console.error("Error fetching annotations");
            }
        } catch (error) {
            console.error("Error fetching annotations:", error);
        }
    };

    useEffect(() => {
        const fetchIdAndAnnotations = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const projectId = parseInt(searchParams.get("id") as string) || 2;

                await fetchAnnotations(projectId);
            } catch (error) {
                console.error("Error fetching annotations:", error);
            }
        };
        fetchIdAndAnnotations();
    }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

    // Update the handleEdit function to include a term parameter
    const handleEdit = async (annotationDetails: Annotation, id: number) => {
        console.log(annotationDetails)
        try {
            const response = await fetch(
                `http://localhost:8000/api/annotations/updateannotation/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(annotationDetails),
                }
            );

            if (response.ok) {
                alert("Annotatie succesvol bijgewerkt");
                fetchAnnotations(annotationDetails.project.id); // Refetch annotations
            } else {
                alert("Fout annotatie bijwerken");
            }
        } catch (error) {
            console.error("Fout annotatie bijwerken:", error);
            alert("Fout annotatie verwijderen");
        }
    };

    /**
     * Delete an annotation
     * This is done by sending a DELETE request to the API, removing the <annotation> tags from the xml and saving the
     * updated XML without the tags.
     *
     * @param id database id of the annotation
     */
    const handleDelete = async (id: number) => {
        try {
            // Remove the annotation from the database
            const response = await fetch(
                `http://localhost:8000/api/annotations/deleteannotation/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                // If everything went well, remove the annotation tags from the XML
                onAnnotationDelete(id)

                // get the project id
                const searchParams = new URLSearchParams(window.location.search);
                const projectId = parseInt(searchParams.get("id") as string);
                setAnnotations(prevAnnotations => prevAnnotations.filter(annotation => annotation.id !== id));

                fetchAnnotations(projectId); // Refetch annotations to update the list
            } else {
                alert("Fout annotatie verwijderen");
            }
        } catch (error) {
            console.error("Fout annotatie verwijderen:", error);
            alert("Fout annotatie verwijderen");
        }
    };

    return (
        <div>
            <div className={css.topBar}>
                <h2 className={css.title}>Annotaties</h2>

                <Image
                    height={100}
                    className={css.image}
                    width={200}
                    src="/juridischanalyseschema.png"
                    alt={"Juridisch Analyseschema"}
                    onClick={() => {
                        setIsModalOpen(!isModalOpen);
                    }}
                />
            </div>

            {isModalOpen && (
                <div
                    className={css.modalContainer}
                    onClick={() => {
                        setIsModalOpen(!isModalOpen);
                    }}
                >
                    <Image
                        height={300}
                        width={450}
                        className={css.imageModal}
                        src="/juridischanalyseschema.png"
                        alt={"Juridisch Analyseschema"}
                    />
                </div>
            )}

            <div className={"annolist p-3 mb-5 bg-white"}>
                {annotations &&
                annotations.map((value, index) => (
                    <div className={css.annotatedRow} key={index}>
                        <AnnotatedRow
                            annotation={value}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnotationView;
