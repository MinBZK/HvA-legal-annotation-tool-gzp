"use client"; // This is a client component 👈🏽

import React, {FC, useEffect, useState} from "react";
import AnnotatedRow from "@/app/annotation-view/annotated-row/annotated-row";
import {Annotation} from "@/app/models/annotation";
import css from "./annotation-view.module.css";
import Image from "next/image"
import {LawClass} from "../models/lawclass";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {createHrefFromUrl} from "next/dist/client/components/router-reducer/create-href-from-url";

interface AnnotationViewProps {
    onAnnotationDelete: (annotationId: number) => void;
}

type GroupedAnnotations = { lawClass: LawClass; annotations: Annotation[]; open: boolean }[];


const AnnotationView: FC<AnnotationViewProps> = ({ onAnnotationDelete }) => {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupedAnnotations, setGroupedAnnotations] = useState<GroupedAnnotations>([]);
    const [childrenAnnotations, setChildrenAnnotations] = useState<Annotation[]>([]);

    const fetchAnnotations = async (projectId: any) => {
        try {
            const response = await fetch(
                `${process.env.API_URL}/annotations/project/${projectId}`
            );

            if (response.ok) {
                const data = await response.json();
                setAnnotations(data);
                setGroupedAnnotations(groupAnnotationsByLawClass(data));
                                
            } else {
                console.error("Error fetching annotations");
            }
        } catch (error) {
            console.error("Error fetching annotations:", error);
        }
    };


    const groupAnnotationsByLawClass = (annotations: Annotation[]): GroupedAnnotations => {
        const groupedAnnotations: GroupedAnnotations = [];

        annotations.forEach(annotation => {
            if (annotation.lawClass) {
                const lawClassName = annotation.lawClass.name;

                const existingGroup = groupedAnnotations.find(group => group.lawClass.name === lawClassName);

                if (existingGroup) {
                    existingGroup.annotations.push(annotation);
                } else {
                    groupedAnnotations.push({
                        lawClass: annotation.lawClass,
                        annotations: [annotation],
                        open: false
                    });
                }
            }
        });
        return groupedAnnotations
    }

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
                fetchAnnotations(annotationDetails.project.id); // Refetch annotations
            } else {
                alert("Fout annotatie bijwerken");
            }
        } catch (error) {
            console.error("Fout annotatie bijwerken:", error);
            alert("Fout annotatie verwijderen");
        }
    };

    const getChildren = async (id: number) => {
        console.log(id)
        try {
            const response = await fetch(`${process.env.API_URL}/annotations/children/${id}`);
            if (response.ok) {
                const data = await response.json();
                // Fetch the children annotations
                console.log(data)
                setChildrenAnnotations(data);
            }
        } catch (error) {
            console.error("Error fetching and deleting children annotations:", error);
            alert("Error fetching and deleting children annotations");
        }
    }

    /**
     * Delete an annotation
     * This is done by sending a DELETE request to the API, removing the <annotation> tags from the xml and saving the
     * updated XML without the tags.
     *
     * @param id database id of the annotation
     */
    const handleDelete = async (id: number) => {
        await getChildren(id);
        console.log(childrenAnnotations)
        console.log(childrenAnnotations.length)

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
                console.log(childrenAnnotations.length)
                if (childrenAnnotations.length > 0) {
                    console.log("Ik kom hierin")
                    for (const child in childrenAnnotations) {
                        console.log(child.id)
                        await onAnnotationDelete(child.id)
                    }
                }

                onAnnotationDelete(id)
                // get the project id
                const searchParams = new URLSearchParams(window.location.search);
                const projectId = parseInt(searchParams.get("id") as string);
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
                    groupedAnnotations.map((value, index) => (
                        <div className={css.annotatedRow} key={index}>
                            <div className={css.annotationTitle} style={{ background: value.lawClass?.color }} onClick={() => {
                                const updatedGroupedAnnotations = [...groupedAnnotations];
                                updatedGroupedAnnotations[index].open = !updatedGroupedAnnotations[index].open;
                                setGroupedAnnotations(updatedGroupedAnnotations);
                            }}>
                                <h5 className={css.annotationName}>{value.lawClass?.name}</h5>
                                {value.open ? (
                                    <FaChevronDown className={css.align} />
                                ) : (
                                    <FaChevronUp />
                                )}
                            </div>
                            {value.annotations.map((annotation, subIndex) => (
                                <AnnotatedRow
                                    key={subIndex}
                                    annotation={annotation}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    open={value.open}
                                />
                            ))}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AnnotationView;
