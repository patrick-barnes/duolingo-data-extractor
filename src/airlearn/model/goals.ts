export interface AirLearnGoal {

    goalUID: string; // "ENGCHN"

    // Used in some API paths, such as learned-lexemes
    // learningLanguage: string; // "ar"
    // fromLanguage: string; // "en"

    // This app will output files to this folder
    commonFolderName: string; // "chinese-english"
};

export type AirLearnGoalMap = {
    [goalUID: string]: AirLearnGoal
};

export const AIRLEARN_GOALS: AirLearnGoalMap = {
    ENGCHN: {
        goalUID: "ENGCHN",
        commonFolderName: "chinese-english",
        // courseId: "DUOLINGO_AR_EN",
        // learningLanguage: "ar",
        // fromLanguage: "en"
    },
};
