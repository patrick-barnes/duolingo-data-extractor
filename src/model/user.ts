export interface User {
    currentCourse: Course;
}

export interface Course {
    id: string; // "DUOLINGO_AR_EN"
    learningLanguage: string; // "ar"
    fromLanguage: string; // "en"
    treeId: string; // "4c2844de4f4c587f943c9f65b9009567"
    pathSectioned: SectionPath[];
    skills: SkillGroup[];
};

export type SkillGroup = Skill[];

export interface Skill {
    id: string;
    name: string; // "Food"
    skillType: string; // "NORMAL"
    tipsAndNotes: string;
}

// "SECTION"
export interface SectionPath {
    id: string; // "0fcdde40b4be564b0f2a71804b14aade-0"
    index: number;
    type: string; // learning
    debugName: string; // Path Section 0
    totalUnits: number; // 10
    units: Unit[];
}

export interface Unit {
    unitIndex: number;
    teachingObjective: string;
    levels: Level[];
}

export interface Level {
    id: string;
    type: string; // "skill", "alphabet"
    debugName: string;
    pathLevelMetadata: {
        skillId: string;
    };
    totalSessions: number; // 4
}
