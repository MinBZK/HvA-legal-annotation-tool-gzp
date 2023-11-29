import React from "react";
import {Annotation} from "@/app/annotation-view/annotation";
import AnnotatedRow from "@/app/annotation-view/annotated-row/annotated-row";
import css from "./annotation-view.module.css"


const AnnotationView = () => {

    const list: Annotation[] = [
        {
            name: "Voorwaarde",
            label: "Laag inkomen",
            note: "No notes",
            legalRelationship: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas",
            color: "#b7d7cd"
        },
        {
            name: "Variable",
            label: "AOW",
            note: "Notes",
            legalRelationship: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas",
            color: "#b7d7cd"
        },
        {
            name: "Rechtsbetrekking",
            label: "SSSS",
            note: "No notes",
            legalRelationship: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas",
            color: "#8ba2cf"
        },
    ]

    return (
        <div>
            <h2 className={css.title}>Annotaties</h2>
            <img className={css.image} src="/public/juridischanalyseschema.png"/>


            {list && list.map((value, index) => (
                <div className={css.annotatedRow} key={index}>
                    <AnnotatedRow annotation={value}/>
                </div>
            ))}

        </div>
    )
}

export default AnnotationView