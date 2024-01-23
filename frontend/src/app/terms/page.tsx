"use client"; // This is a client component 👈🏽

import React, {useEffect, useState} from "react";
import {Term} from "@/app/models/term";
import '../static/terms.css';
import {BsArrowLeft} from "react-icons/bs";
import {useRouter} from "next/navigation";
import Navigation from "../components/navigation/navigation";


const TermsPage = () => {
    const [terms, setTerms] = useState<Term[]>()
    const router = useRouter();

    useEffect(() => {
        fetchTerms()
    }, [])

    const handleGoBack = () => {
        router.push('/');
    };


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
            <Navigation></Navigation>

            <button className="back-button"
                    onClick={handleGoBack}>
                <BsArrowLeft className="icon" /> Terug
            </button>

            <div className={"d-flex justify-content-center"}>
                <h2 className={"doc-text m-3"}>Begrippen</h2>
            </div>

            {terms && terms.map((value, index) =>
                <div key={index}>
                    <div className={"term-block"}>
                        <h5>&quot;{value.definition}&quot;
                            {/*staat in &nbsp;*/}
                            {/*<span style={{textDecoration: "underline"}}>"{value.annotations[0].project.title}"</span>*/}
                        </h5>
                        <h5 className={"reference"}>Refereert naar &quot;{value.reference}&quot;</h5>
                    </div>

                </div>
            )}
        </>
    )
}

export default TermsPage;
