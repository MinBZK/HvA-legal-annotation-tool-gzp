"use client"; // This is a client component 👈🏽

import React, {FC, useState} from "react";
import {FaChevronDown} from "react-icons/fa";
import {FaChevronUp} from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import css from "./annotated-row.module.css";

interface AnnotatedProps {
    color: string
    name: string
    label: string
    note?: string
    definition?: string
}

const AnnotatedRow: FC<AnnotatedProps> = ({name,color, label, note, definition}) => {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <div className={css.annotationTitle} style={{background: color}} onClick={() => {
                setOpen(!open)
            }}>
                <h4>{name}</h4>

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
                        <h4 className={css.rightCol}>{label}</h4>
                        <FaEdit className={css.iconCol}/>
                    </div>
                    <div className={css.row}>
                        <h4 className={css.leftCol}>Notitie</h4>
                        <h4 className={css.rightCol}>{note}</h4>
                    </div>
                    <div className={css.row}>
                        <h4 className={css.leftCol}>Begrip</h4>
                        <h4 className={css.rightCol}>{definition}</h4>
                    </div>
                </div>
            }
        </div>
    )
}

export default AnnotatedRow