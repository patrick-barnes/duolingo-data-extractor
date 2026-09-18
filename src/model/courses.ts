export interface LanguageCourse {

    // Used in some API paths, such as sessions
    courseId: string; // "DUOLINGO_AR_EN"

    // Used in some API paths, such as learned-lexemes
    learningLanguage: string; // "ar"
    fromLanguage: string; // "en"

    // This app will output files to this folder
    // Commented out because this is now calculated
    // via commonFolderNameFor(course).
    // commonFolderName: string; // "arabic-english"
};

export type LanguageCourseMap = {
    [courseName: string]: LanguageCourse
};

export const LANG_CODE_TO_LANG_NAME: { [langCode: string]: string } = {
    "en": "English",
    "ar": "Arabic",
    "es": "Spanish",
    "zh": "Chinese", // learningLanguage for CHINESE_ENGLISH, fromLanguage for CANTONESE_CHINESE
    "hi": "Hindi",
    "ja": "Japanese",
    "ru": "Russian",
    "ko": "Korean",
    "te": "Telugu",
    "tl": "Tagalog",
    "zc": "Cantonese",
    // "zs": "Chinese" // so far, I've seen this only in ui-language but not learningLanguage or fromLanguage
};

export const LANGUAGE_COURSES: LanguageCourseMap = {
    ARABIC_ENGLISH: {
        //commonFolderName: "arabic-english",
        courseId: "DUOLINGO_AR_EN",
        learningLanguage: "ar",
        fromLanguage: "en"
    },
    SPANISH_ENGLISH: {
        //commonFolderName: "spanish-english",
        courseId: "DUOLINGO_ES_EN",
        learningLanguage: "es",
        fromLanguage: "en"
    },
    CHINESE_ENGLISH: {
        //commonFolderName: "chinese-english",
        courseId: "DUOLINGO_ZH-CN_EN",
        learningLanguage: "zh",
        fromLanguage: "en"
    },
    HINDI_ENGLISH: {
        //commonFolderName: "hindi-english",
        courseId: "DUOLINGO_HI_EN",
        learningLanguage: "hi",
        fromLanguage: "en"
    },
    JAPANESE_ENGLISH: {
        //commonFolderName: "japanese-english",
        courseId: "DUOLINGO_JA_EN",
        learningLanguage: "ja",
        fromLanguage: "en"
    },
    RUSSIAN_ENGLISH: {
        //commonFolderName: "russian-english",
        courseId: "DUOLINGO_RU_EN",
        learningLanguage: "ru",
        fromLanguage: "en"
    },
    KOREAN_ENGLISH: {
        //commonFolderName: "korean-english",
        courseId: "DUOLINGO_KO_EN",
        learningLanguage: "ko",
        fromLanguage: "en"
    },
    ENGLISH_TELUGU: {
        //commonFolderName: "english-telugu",
        courseId: "DUOLINGO_EN_TE",
        learningLanguage: "en",
        fromLanguage: "te"
    },
    ENGLISH_TAGALOG: {
        //commonFolderName: "english-tagalog",
        courseId: "DUOLINGO_EN_TL",
        learningLanguage: "en",
        fromLanguage: "tl"
    },
    CANTONESE_CHINESE: {
        //commonFolderName: "cantonese-chinese",
        courseId: "DUOLINGO_ZH-HK_ZH-CN",
        learningLanguage: "zc", // some APIs say "zc", some say "zh-HK", but "zc" seems to work for our purposes
        fromLanguage: "zh"
    },
};

export const commonFolderNameFor = function(course: { learningLanguage: string; fromLanguage: string; }) {
    let learningLanguageName = LANG_CODE_TO_LANG_NAME[course.learningLanguage];
    let fromLanguageName = LANG_CODE_TO_LANG_NAME[course.fromLanguage];
    return `${learningLanguageName?.toLowerCase()}-${fromLanguageName?.toLowerCase()}`;
}

export const learningLanguageNameFor = function(course: { learningLanguage: string; fromLanguage: string; }) {
    return LANG_CODE_TO_LANG_NAME[course.learningLanguage];
}

export const fromLanguageNameFor = function(course: { learningLanguage: string; fromLanguage: string; }) {
    return LANG_CODE_TO_LANG_NAME[course.fromLanguage];
}
