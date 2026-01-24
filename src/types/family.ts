export interface Family{
    id: string,
    name: string,
    createdBy: string
}

export interface Role{
    id: string,
    name: string,
    value: number,
    accessList: string[],
}

export interface PersonalInfo{
    id: string,
    firstname: string,
    lastname: string,
    birthDate: string,
    roles: Role[]
}

export interface FamilyMember{
    id: string,
    username: string,
    personalInfo: PersonalInfo
    family: Family,
    addedAt: Date
}