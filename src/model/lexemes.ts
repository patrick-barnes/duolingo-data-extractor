export interface ProgressedSkill {
    finishedLevels: number; // 1
    finishedSessions: number; // 4
    skillId: {
        id: string; // "2d7cdde5549f60bdbd38bf6e169df853"
    }
};

export interface GetLearnedLexemesRequest {
    lastTotalLexemeCount: number, // 0,
    progressedSkills: ProgressedSkill[];
};

export interface LearnedLexeme {
    text: string; // "अ"
    translations: string[]; // ["(as in \"u\"nder)", "(as in \"u\"s)", "uh", "ə"]
    audioURL?: string; // "https://d1vq87e9lcf771.cloudfront.net/abhi/da870029b09338bcdb898782838a6c5e",
    isNew: boolean; // true
};

export interface GetLearnedLexemesResponse {
    learnedLexemes: LearnedLexeme[],
    pagination: {
        totalLexemes: number; // 533,
        requestedPageSize: number; // 50,
        pageSize: number; // 50, 50, 50, ..., 33
        previousStartIndex: number; // null, 0, 50, ..., 450
        nextStartIndex: number; // 50, 100, 150, ..., null
    }
};
