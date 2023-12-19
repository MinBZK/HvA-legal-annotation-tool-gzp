"use client";
import AnnotationView from '../annotation-view/annotation-view';
import '../static/annotations.css';
import {getProjectById} from '../services/project';
import { Project } from '../models/project';
import { useSearchParams } from 'next/navigation'
import {useEffect, useState} from "react";
import LoadXML from "./comment/render-xml";
import CreateAnnotation from "./create-annotation/create-annotation";

const AnnotationPage = () => {

    const [projectData, setProjectData] = useState<Project | null>(null);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [startOffset, setStartOffset] = useState(0);

    // Get id from url
    const searchParams = useSearchParams();
    let id: number = 2;

    if (searchParams != null) {
        const param = searchParams.get('id');
        id = param != null ? parseInt(param) : 2;
        if (isNaN(id)) id = 2;
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
    }, [id]);

    const handleTextSelection = (text: string, offset: number) => {
        setIsTextSelected(true);
        setSelectedText(text);
        setStartOffset(offset)
    };

    const handleCloseCreate = () => {
        setIsTextSelected(false);
        setSelectedText("");
        setStartOffset(0);
    }

  return (
    <>
      <nav className="navbar">
        {<div className="navbar-title">Legal Annotation Tool</div>}
      </nav>
      <main className='d-flex'>
        <section className="left-column">
            {projectData && <LoadXML project={projectData}  onTextSelection={handleTextSelection}
            />}
        </section>
        <section className="right-column">
            {isTextSelected ? (
                // Render Create annotation when text is selected
                <CreateAnnotation selectedText={selectedText} startOffset={startOffset} onClose={handleCloseCreate}/>
            ) : (
                // Render AnnotationView when text is not selected
                <AnnotationView/>
            )}
        </section>
      </main>
    </>
  );
}

export default AnnotationPage;
