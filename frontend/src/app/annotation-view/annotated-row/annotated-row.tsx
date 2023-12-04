"use client"; // This is a client component 👈🏽

import React, {FC, useEffect, useState} from "react";
import {Annotation} from "@/app/annotation-view/annotation";
import {FaChevronDown} from "react-icons/fa";
import {FaChevronUp} from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import css from "./annotated-row.module.css";

interface AnnotatedProps {
    annotation: Annotation
}

const AnnotatedRow: FC<AnnotatedProps> = ({annotation}) => {

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        console.warn(open)
    }, [open])

    return (
        <div>
            <div className={css.annotationTitle} style={{background: annotation.color}} onClick={() => {
                setOpen(!open)
            }}>
                <h4>{annotation.name}</h4>

                {open ? (
                    <FaChevronDown className={css.align}/>
                ) : (
                    <FaChevronUp/>
                )}
            </div>

            {open &&
                <div className={css.annotationInfo}>
                    <div className={css.row}>
                        <h4 className={css.leftCol}>Label</h4>
                        <h4 className={css.rightCol}>{annotation.label}</h4>
                        <FaEdit className={css.iconCol}/>
                    </div>
                    <div className={css.row}>
                        <h4 className={css.leftCol}>Notitie</h4>
                        <h4 className={css.rightCol}>{annotation.note}</h4>
                    </div>
                    <div className={css.row}>
                        <h4 className={css.leftCol}>Begrip</h4>
                        <h4 className={css.rightCol}>{annotation.legalRelationship}</h4>
                    </div>
                </div>
            }
        </div>
    )
}

export default AnnotatedRow