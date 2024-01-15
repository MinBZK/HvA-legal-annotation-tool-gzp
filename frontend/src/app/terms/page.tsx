"use client"; // This is a client component 👈🏽

import React, {useEffect, useState} from "react";
import {Term} from "@/app/models/term";
import '../static/terms.css';


const TermsPage = () => {
    const [terms, setTerms] = useState<Term[]>()

    useEffect(() => {
        fetchTerms()
    }, [])

    const fetchTerms = async () => {
        // fetching the terms
        try {
            const response = await fetch('http://localhost:8000/api/terms');

            if (response.ok) {
                setTerms(await response.json());
            } else {
                console.error('Response not ok', response);
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching max XML count:', error);
        }
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-title">Legal Annotation Tool</div>
            </nav>

            <div className={"d-flex justify-content-center"}>
                <h2 className={"doc-text m-3"}>Begrippen</h2>
            </div>

            {terms && terms.map((value, index) =>
                <div key={index}>
                    <div className={"term-block"}>
                        <h5>"{value.definition}"
                            {/*staat in &nbsp;*/}
                            {/*<span style={{textDecoration: "underline"}}>"{value.annotations[0].project.title}"</span>*/}
                        </h5>
                        <h5 className={"reference"}>Refereert naar "{value.reference}"</h5>
                    </div>

                </div>
            )}
        </>
    )
}

export default TermsPage;