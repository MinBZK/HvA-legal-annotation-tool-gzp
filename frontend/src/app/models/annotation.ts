import {Class} from "@/app/models/class";
import {Project} from "@/app/models/project";

export interface Annotation {
    id: number,
    text: string,
    selectedWord: string,
    annotationClass: Class,
    project: Project
}