import { Annotation } from "./annotation";

export interface Term {
    id: number,
    definition: string | undefined,
    reference: string,
    annotations: Annotation[]
}