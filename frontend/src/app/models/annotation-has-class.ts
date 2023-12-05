import {Annotation} from "@/app/models/annotation";
import {Class} from "@/app/models/class";

export interface AnnotationHasClass {
    id: number,
    annotation: Annotation,
    aClass: Class,
    isMainClass: boolean
}