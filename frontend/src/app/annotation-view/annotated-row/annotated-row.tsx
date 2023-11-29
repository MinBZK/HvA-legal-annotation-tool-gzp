import React, {FC} from "react";
import {Annotation} from "@/app/annotation-view/annotation";
import css from "./annotated-row.module.css";

interface AnnotatedProps {
    annotation: Annotation
}

const AnnotatedRow: FC<AnnotatedProps> = ({annotation}) => {

    return (
        <>
            <div className={css.annotationName} style={{background: annotation.color}}>
                <h4>{annotation.name}</h4>
            </div>

            <div className={css.row}>
                <h4 className={css.leftCol}>Label</h4>
                <h4 className={css.rightCol}>{annotation.label}</h4>
            </div>
            <div className={css.row}>
                <h4 className={css.leftCol}>Notitie</h4>
                <h4 className={css.rightCol}>{annotation.note}</h4>
            </div>
            <div className={css.row}>
                <h4 className={css.leftCol}>Rechtsbetrekking</h4>
                <h4 className={css.rightCol}>{annotation.legalRelationship}</h4>
            </div>
        </>
    )
}

export default AnnotatedRow