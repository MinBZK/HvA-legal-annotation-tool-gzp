import React, {FC} from "react";
import {Annotation} from "@/app/annotation-view/annotation";

interface AnnotatedProps {
    annotation: Annotation
}

const AnnotatedRow: FC<AnnotatedProps> = ({annotation}) => {

    return (
        <>
            <div>
                <h4>Label</h4>
                <h4>{annotation.label}</h4>
            </div>
            <div>
                <h4>Notitie</h4>
                <h4>{annotation.note}</h4>
            </div>
            <div>
                <h4>Rechtsbetrekking</h4>
                <h4>{annotation.legalRelationship}</h4>
            </div>
        </>
    )
}

export default AnnotatedRow