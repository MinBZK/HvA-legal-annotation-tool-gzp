import { LawClass } from "@/app/models/lawclass";
import { Project } from "@/app/models/project";
import { Term } from "@/app/models/term";
import {Relation} from "./relation";

export interface Annotation {
    id: number,
    text: string | undefined,
    selectedWord: string,
    lawClass: LawClass | undefined,
    project: Project
    startOffset?: number,
    term: Term | null,
    parentAnnotation: Annotation
    relation: Relation
}
