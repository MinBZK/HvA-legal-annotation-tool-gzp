"use client"
import AnnotationView from '../annotation-view/annotation-view';
import Popup from '../annotations/comment/page';
import '../static/annotations.css';
import { getProjectById } from '../services/project';
import { Project } from './project';
import { useSearchParams } from 'next/navigation'

export default async function AnnotationPage() {

  //Get id from url
  const searchParams = useSearchParams()
  let id: number = 1;

  if (searchParams != null) {
    const param = searchParams.get('id');
    id = param != null ? parseInt(param) : 1;
    if (isNaN(id)) id = 1;
  }

  const projectData = await getProjectById(id) as Project;

  return (
    <>
      <nav className="navbar">
        {<div className="navbar-title">Legal Annotation Tool</div>}
      </nav>
      <main className="container">
        <section className="left-column">
          {<Popup project={projectData}></Popup>}
        </section>
        <section className="right-column">
          {<AnnotationView></AnnotationView>}
        </section>
      </main>
    </>
  );
}
