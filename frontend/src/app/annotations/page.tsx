import AnnotationView from '../annotation-view/annotation-view';
import '../static/annotations.css';

export default function AnnotationPage() {
  return (
    <>
      <nav className="navbar">
        {<div className="navbar-title">Legal Annotation Tool</div>}
      </nav>
      <main className="container">
        <section className="left-column">
          {/* Left column content here */}
        </section>
        <section className="right-column">
          {<AnnotationView></AnnotationView>}
        </section>
      </main>
    </>
  );
}
