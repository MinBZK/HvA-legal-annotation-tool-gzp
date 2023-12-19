import {Annotation} from "./annotation";

export interface Project {
    id: number,
    title: string,
    xml_content: string,
    selectedArticles: string,
    annotations: Array<Annotation>
}
