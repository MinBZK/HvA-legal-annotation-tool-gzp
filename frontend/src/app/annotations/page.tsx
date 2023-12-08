"use client";
import AnnotationView from '../annotation-view/annotation-view';
import Popup from '../annotations/comment/annotation-popup';
import '../static/annotations.css';
import {getProjectById} from '../services/project';
import { Project } from '../models/project';
import { useSearchParams } from 'next/navigation'
import {useEffect, useState} from "react";

const AnnotationPage = () => {

    const [projectData, setProjectData] = useState<Project | null>(null);

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

  return (
    <>
      <nav className="navbar">
        {<div className="navbar-title">Legal Annotation Tool</div>}
      </nav>
      <main className="container">
        <section className="left-column">
            {projectData && <Popup project={projectData} />}
        </section>
        <section className="right-column">
          {<AnnotationView/>}
        </section>
      </main>
    </>
  );
}

export default AnnotationPage;
