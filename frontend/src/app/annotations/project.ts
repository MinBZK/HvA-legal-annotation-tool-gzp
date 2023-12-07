import { Annotation } from "../annotation-view/annotation";

export interface Project {
    id: number,
    xml_content: string,
    selectedArticles: string,
    annotations: Array<Annotation>
}