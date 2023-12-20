import {LawClass} from "@/app/models/lawclass";
import {Project} from "@/app/models/project";
import {Term} from "@/app/models/term";

export interface Annotation {
    id: number,
    text: string,
    selectedWord: string,
    lawClass: LawClass | undefined,
    project: Project
    startOffset?: number;
    term: Term | undefined;
}
