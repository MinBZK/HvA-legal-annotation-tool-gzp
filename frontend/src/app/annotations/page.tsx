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
import Navigation from '../components/navigation/navigation';
import { User } from "@/app/models/user";

const AnnotationPage = () => {

    const [projectData, setProjectData] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [selectedText1, setSelectedText1] = useState("");
    const [tempId1, settempId1] = useState(0);

    const [selectedText2, setSelectedText2] = useState("");
    const [tempId2, settempId2] = useState(0);
    const [xmlContent, setXmlContent] = useState("");

    const [activeSelection, setActiveSelection] = useState(1);
    const [reloadXML, setReloadXML] = useState(false);
    const [currentUser, setCurrentUser] = useState<User>(
        { name: "", id: -1, role: "" }
    );
    const [allowSelect, setAllowSelect] = useState(true);

    // Get id from url
    const searchParams = useSearchParams();
    let id: number = 0;

    if (searchParams != null) {
        const param = searchParams.get('id');
        id = param != null ? parseInt(param) : 0;
        if (isNaN(id)) id = 0;
    }

    useEffect(() => {
        const localString = localStorage.getItem("user")

        if (localString != null) {
            const localUser = JSON.parse(localString)
            setCurrentUser(localUser)
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const data = await getProjectById(id) as Project;
                setProjectData(data);
            } catch (error) {
                // Handle error
                console.error('Error fetching project data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, reloadXML]);

    const handleTextSelection = (text: string, offset: number) => {
        if (activeSelection === 1) {
            setAllowSelect(false);
            setSelectedText1(text);
            settempId1(offset);
        } else if (activeSelection === 2) {
            setAllowSelect(false);
            setSelectedText2(text);
            settempId2(offset);
        }
        setIsTextSelected(true);
    };

    const handleAllowSelect = () => {
        setAllowSelect(true);
    }

    const handleCloseCreate = () => {
        setIsTextSelected(false);
        setSelectedText1("");
        settempId1(0);
        setSelectedText2("");
        settempId2(0);
        setActiveSelection(1); // Reset to the first selection
    }

    const handleAnnotationSaved = () => {
        setReloadXML((prev) => !prev);
    };

    const handleSetActiveSelection = (selection: number) => {
        console.log("Setting Active Selection:", selection);
        setActiveSelection(selection);
        console.log(activeSelection)
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
    }

    /**
     * Update the XML in the database after removing an annotation
     *
     * @param annotationId The id of the annotation to remove
     */
    const updateXML = async (annotationId: number) => {
        if (projectData == null) return;

        try {
            // Create a copy of Project to avoid mutating the original object
            const updatedProject = {
                ...projectData,
            };

            const response = await fetch(`${process.env.API_URL}/saveXml`, {
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

    /**
     * Extract all annotation tags from the XML, loop trough them and perform the api calls to fetch them all.
     */
    const retrieveAnnotations = async () => {
        let xmlDoc = projectData?.xml_content
        if (!xmlDoc) return []; // Return an empty array if xmlDoc is null

        // Convert the XML string to a DOM object
        let parser = new DOMParser();
        let xmlDom = parser.parseFromString(xmlDoc, "text/xml");

        const annotations = xmlDom.getElementsByTagName('annotation');
        let temporaryAnnotations = [];

        // Loop through the annotations and display the id
        // @ts-ignore
        for (let annotation of annotations) {
            const id = annotation.getAttribute('id');
            if (id) {
                const response = await fetch(`http://localhost:8000/api/annotations/${id}`);
                if (response.ok) {
                    const annotationData = await response.json();
                    temporaryAnnotations.push(annotationData);
                } else {
                    console.error('Failed to fetch annotation data');
                }
            }
        }

        return temporaryAnnotations;
    }

    const handleCancel = () => {
        const tempAnnotation = document.getElementsByTagName('temp-annotation');
        for (let i = 0; i < tempAnnotation.length; i++) {
            const element = tempAnnotation[i];
            const content = element.innerHTML;
            element.insertAdjacentHTML('afterend', content);
            if (element) {
                element.remove();
            }
        }
        const temp = projectData;
        if (temp) {
            temp.xml_content = new XMLSerializer().serializeToString(document.getElementsByClassName('xml-content')[0]);
            setProjectData(temp);
        }
    }

    return (
        <>
            <Navigation></Navigation>
            <main className='d-flex'>
                <section className="left-column">
                    {projectData && <LoadXML project={projectData} onTextSelection={handleTextSelection} allowSelect={allowSelect}
                    />}
                </section>
                <section className="right-column">
                    {isTextSelected ? (
                        // Render Create annotation when text is selected
                        <CreateAnnotation selectedText1={selectedText1}
                            selectedText2={selectedText2}
                            tempId1={tempId1}
                            tempId2={tempId2}
                            onSetActiveSelection={handleSetActiveSelection}
                            onClose={handleCloseCreate} onAnnotationSaved={handleAnnotationSaved} // Pass the callback
                            currentUser={currentUser}
                            addRelation={handleAllowSelect}
                            cancel={handleCancel}
                        />
                    ) : (
                        // Render AnnotationView when text is not selected
                        <AnnotationView onAnnotationDelete={handleAnnotationDeleted}
                            retrieveAnnotations={retrieveAnnotations}
                            isLoading={isLoading}
                        />
                    )}
                </section>
            </main>
        </>
    );
}

export default AnnotationPage;
