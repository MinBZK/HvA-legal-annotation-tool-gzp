"use client";
import AnnotationView from '../annotation-view/annotation-view';
import '../static/annotations.css';
import { getProjectById } from '../services/project';
import { Project } from '../models/project';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import LoadXML from "./comment/render-xml";
import CreateAnnotation from "./create-annotation/create-annotation";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from 'react-icons/bs';
import Navigation from '../components/navigation/navigation';

const AnnotationPage = () => {

    const [projectData, setProjectData] = useState<Project | null>(null);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [selectedText1, setSelectedText1] = useState("");
    const [startOffset1, setStartOffset1] = useState(0);

    const [selectedText2, setSelectedText2] = useState("");
    const [startOffset2, setStartOffset2] = useState(0);

    const [activeSelection, setActiveSelection] = useState(1);
    const [reloadXML, setReloadXML] = useState(false);
    const router = useRouter();

    // Get id from url
    const searchParams = useSearchParams();
    let id: number = 0;

    if (searchParams != null) {
        const param = searchParams.get('id');
        id = param != null ? parseInt(param) : 0;
        if (isNaN(id)) id = 0;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProjectById(id) as Project;
                setProjectData(data);
            } catch (error) {
                // Handle error
                console.error('Error fetching project data:', error);
            }
        };

        fetchData();
    }, [id, reloadXML]);

    const handleTextSelection = (text: string, offset: number) => {
        if (activeSelection === 1) {
            setSelectedText1(text);
            setStartOffset1(offset);
        } else if (activeSelection === 2) {
            setSelectedText2(text);
            setStartOffset2(offset);
        }

        // Toggle between active selections
        // setActiveSelection(activeSelection === 1 ? 2 : 1);

        setIsTextSelected(true);
    };

    const handleCloseCreate = () => {
        setIsTextSelected(false);
        setSelectedText1("");
        setStartOffset1(0);
        setSelectedText2("");
        setStartOffset2(0);
        setActiveSelection(1); // Reset to the first selection
    }

    const handleAnnotationSaved = () => {
        setReloadXML((prev) => !prev);
    };

    const handleGoBack = () => {
        router.push('/');
    };

    const handleToggleActiveSelection = () => {
        setActiveSelection((prevActiveSelection) => (prevActiveSelection === 1 ? 2 : 1));
    };

    /**
     * Delete the <annotation> tags with the given id from the XML and update the XML in the database.
     *
     * @param annotationId The id of the annotation to delete
     */
    const handleAnnotationDeleted = async (annotationId: number) => {
        // Get the XML content
        let xml = projectData?.xml_content

        if (xml == null || projectData == null) return;

        // Convert the XML string to a DOM object
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        // Get the annotation with the given id
        let annotation = xmlDoc.getElementById(annotationId.toString());

        if (annotation == null) return;

        // Remove the annotation tags by replacing them with the innerHTML
        annotation.replaceWith(annotation.innerHTML);

        // Convert the DOM object back to a string
        xml = new XMLSerializer().serializeToString(xmlDoc);
        projectData.xml_content = xml;

        // Reload the XML
        setReloadXML((prev) => !prev);

        // Update the XML in the database
        await updateXML(annotationId);
    }

    /**
     * Update the XML in the database after removing an annotation
     *
     * @param annotationId The id of the annotation to remove
     */
    const updateXML = async (annotationId: number) => {
        if (projectData == null) return;

        try {
            // Remove the annotation from the projectData to prevent it from being saved again
            projectData.annotations = projectData.annotations.filter((annotation) => annotation.id !== annotationId);

            // Create a copy of Project to avoid mutating the original object
            const updatedProject = {
                ...projectData,
            };

            const response = await fetch('${process.env.API_URL}/saveXml', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject)
            });

            if (!response.ok) {
                throw new Error('Failed to update XML');
            }

            console.log('XML updated successfully');
        } catch (error) {
            console.error('Error updating XML:', error);
        }
    }


    return (
        <>
            <Navigation></Navigation>
            <main className='d-flex'>
                <section className="left-column">
                    <Button variant="light" className="back-button p-2 m-1"
                        onClick={handleGoBack}>
                        <BsArrowLeft size={23} className="icon" /> Terug
                    </Button>
                    {projectData && <LoadXML project={projectData} onTextSelection={handleTextSelection}
                    />}
                </section>
                <section className="right-column">
                    {isTextSelected ? (
                        // Render Create annotation when text is selected
                        <CreateAnnotation selectedText1={selectedText1}
                            selectedText2={selectedText2}
                            startOffset1={startOffset1}
                            startOffset2={startOffset2}
                            activeSelection={activeSelection}
                            onToggleActiveSelection={handleToggleActiveSelection}
                            onClose={handleCloseCreate} onAnnotationSaved={handleAnnotationSaved} // Pass the callback
                        />
                    ) : (
                        // Render AnnotationView when text is not selected
                        <AnnotationView onAnnotationDelete={handleAnnotationDeleted} />
                    )}
                </section>
            </main>
        </>
    );
}

export default AnnotationPage;
