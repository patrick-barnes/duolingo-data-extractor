export interface GetSessionRequest {
    learningLanguage: string; // "zh"
    fromLanguage: string; // "en"
    treeId: string; // "798846c15f4a81c6556fa7d96e42d0e3"
    levelIndex: number; // 0
    levelSessionIndex: number; // 4
    skillIds?: string[];
    type: string; // "LEXEME_SKILL_LEVEL_PRACTICE"
    challengeTypes?: string[];
    isFinalLevel: boolean; // false
    isV2: boolean; // true
    juicy: boolean; // true
    shakeToReportEnabled: boolean;
    pathExperiments?: string[];
};

export interface Session {
    id: string; // "C3z4qXOcFuQDW3I9"
    learningLanguage: string; // "zh"
    fromLanguage: string; // "en"
    type: string; // "LEXEME_SKILL_LEVEL_PRACTICE"
    challenges: Challenge[];
    adaptiveChallenges: Challenge[];
    //adaptiveInterleavedChallenges: {challenges: InterleavedChallenge[];}
};

export interface Challenge {
    id: string; // "7a8b8ff41c534332816d4bf94259afaa",
    type: string; // "listenTap", "tapComplete", "translate"
    skillTreeId?: string; // "798846c15f4a81c6556fa7d96e42d0e3"
    sentenceId?: string; // "e3f3f8d5f1b94a0e1e4f2e3b6c5d7a8b"
    prompt?: string; // "coffee"
    solutionTranslation?: string; // "咖啡"
    metadata: {
        text: string; // "coffee"
        specific_type?: string; // "name_example"
        skill_tree_id?: string; // "798846c15f4a81c6556fa7d96e42d0e3"
        source_language: string; // "zs"
        learning_language: string; // "zs"
        from_language: string; // "en"
    };
};
