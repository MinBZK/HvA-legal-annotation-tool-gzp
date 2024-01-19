import { LawClass } from "@/app/models/lawclass";
import { Project } from "@/app/models/project";
import { Term } from "@/app/models/term";
import {Relation} from "./relation";
import {User} from "@/app/models/user";

export interface Annotation {
    id: number,
    text: string | undefined,
    selectedWord: string,
    lawClass: LawClass | undefined,
    project: Project
    tempId?: number,
    term: Term | null,
    parentAnnotation: Annotation
    relation: Relation

    created_at: number,
    created_by: User,
    updated_at: number,
    updated_by: User,
}
