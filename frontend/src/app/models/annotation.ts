import {LawClass} from "@/app/models/lawclass";
import {Project} from "@/app/models/project";

export interface Annotation {
    id: number,
    text: string,
    selectedWord: string,
    lawClass: LawClass,
    project: Project
}