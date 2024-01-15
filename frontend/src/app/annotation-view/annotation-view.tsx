"use client"; // This is a client component 👈🏽

import React, {FC, useEffect, useState } from "react";
import AnnotatedRow from "@/app/annotation-view/annotated-row/annotated-row";
import { Annotation } from "@/app/models/annotation";
import css from "./annotation-view.module.css";
import Image from "next/image"
import {Project} from "@/app/models/project";

interface AnnotationViewProps {
    onAnnotationDelete: (annotationId: number) => void;
    retrieveAnnotations: () => Promise<Annotation[]>;
    isLoading: boolean;
}

const AnnotationView: FC<AnnotationViewProps> = ({onAnnotationDelete, retrieveAnnotations, isLoading}) => {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * Calls the retrieveAnnotations function to fetch the annotations from the database and sets the annotations state
     */
    const fetchAnnotations = async () => {
        let annotations = await retrieveAnnotations();

        if (annotations) {
            // Filter out null annotations
            annotations = annotations.filter(annotation => annotation != null);

            setAnnotations(annotations);
        } else {
            console.error("Geen annotaties opgehaald");
        }
    };

    useEffect(() => {
        (async () => {
            if (!isLoading) {
                await fetchAnnotations();
            }
        })();
        // The isLoading dependency is used to make sure the annotations are only fetched once the project data is loaded
    }, [isLoading]);

    // Update the handleEdit function to include a term parameter
    const handleEdit = async (annotationDetails: Annotation, id: number) => {
        console.log(annotationDetails)
        try {
            const response = await fetch(
                `${process.env.API_URL}/annotations/updateannotation/${id}`,
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
                fetchAnnotations(); // Refetch annotations
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
                `${process.env.API_URL}/annotations/deleteannotation/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                // If everything went well, remove the annotation tags from the XML
                onAnnotationDelete(id)

                await fetchAnnotations(); // Refetch annotations to update the list
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
