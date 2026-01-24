import type {FamilyMember} from "@/types/family.ts";

export interface Task{
    id : string,
    taskName: string,
    description: string,
    createdBy: FamilyMember,
    issuedTo: FamilyMember,
    createdDate: Date,
    dueDate: Date,
    isMarked: boolean,
    isChecked: boolean
}
