"use client"; // This is a client component 👈🏽

import React, {useState} from "react";
import {Annotation} from "@/app/annotation-view/annotation";
import AnnotatedRow from "@/app/annotation-view/annotated-row/annotated-row";
import css from "./annotation-view.module.css"


const AnnotationView = () => {

    const list: Annotation[] = [
        {
            name: "Voorwaarde",
            label: "Laag inkomen",
            note: "No notes",
            definition: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas",
            color: "#b7d7cd"
        },
        {
            name: "Variable",
            label: "AOW",
            note: "Notes",
            definition: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas",
            color: "#b7d7cd"
        },
        {
            name: "Rechtsbetrekking",
            label: "SSSS",
            note: "No notes",
            definition: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas dhdhyahjashja  aadhadhjdahjad ",
            color: "#8ba2cf"
        },
    ]
    const [isModalOpen, setIsModalOpen] = useState(false)


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
                {list && list.map((value, index) => (
                    <div className={css.annotatedRow} key={index}>
                        <AnnotatedRow name={value.name} color={value.color} label={value.label}/>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default AnnotationView