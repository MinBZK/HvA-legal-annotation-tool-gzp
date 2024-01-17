import { LawClass } from "@/app/models/lawclass";
import { Project } from "@/app/models/project";
import { Term } from "@/app/models/term";
import {User} from "@/app/models/user";

export interface Annotation {
    id: number,
    text: string | undefined,
    selectedWord: string,
    lawClass: LawClass | undefined,
    project: Project
    startOffset?: number,
    term: Term | null,
    parentAnnotation: Annotation,

    created_at: number,
    created_by: User,
    updated_at: number,
    updated_by: User,
}
