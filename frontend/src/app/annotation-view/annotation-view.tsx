import React from "react";
import css from "./annotation-view.module.css"
import {Annotation} from "@/app/annotation-view/annotation";

const AnnotationView = () => {

    const list: Annotation[] = [
        {
            label: "Laag inkomen",
            note: "No notes",
            legalRelationship: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas",
            color: "#b7d7cd"
        },
        {
            label: "AOW",
            note: "Notes",
            legalRelationship: "Lorem ipsum dolor sit amet. Aut quae voluptatem ut voluptas",
            color: "#b7d7cd"
        },
        {
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
        </div>
    )
}

export default AnnotationView