import AnnotationView from '../annotation-view/annotation-view';
import Popup from '../annotations/comment/page';
import '../static/annotations.css';
import { getProjectById } from '../services/project';
import { Project } from './project';

export default async function AnnotationPage() {

  const projectData = await getProjectById(3) as Project;

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
