import { Annotation } from "./annotation";

export interface Term {
    id: number,
    definition: string,
    reference: string,
    annotations: Annotation[]
}