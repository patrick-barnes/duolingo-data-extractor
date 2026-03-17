import { FM, readJsonFromFile, writeStringToFile } from './file-util.js';
import { transliterateArabic } from "./arabic-transliterator.js";
import { transliterateHindi } from "./hindi-transliterator.js";
import type { LearnedLexeme } from './model/lexemes.js';
import { CURRENT_COURSE } from './config.js';
import { LANGUAGE_COURSES, type LanguageCourse } from './model/courses.js';

interface Note {
    //id: string;
    english: string;
    context: string;
    foreign: string;
    transliteration: string;
    tip: string;
    sources: string;
    debug: string;
};

function noteToTsvRow(note: Note): string {
    let row = [
        //note.id,
        note.english,
        note.context,
        note.foreign,
        note.transliteration,
        note.tip,
        note.sources,
        note.debug
    ].join('\t');
    return row;
}

const NOTE_TSV_HEADERS = [
    //"ID",
    "English",
    "Context",
    "Foreign",
    "Transliteration",
    "Tip",
    "Sources",
    "Debug"
];

function getChallenges(sessionData: any): any[] {
    let allChallenges: any[] = [];
    allChallenges = allChallenges.concat(sessionData.challenges);
    allChallenges = allChallenges.concat(sessionData.adaptiveChallenges);
    allChallenges = allChallenges.concat(sessionData.mistakesReplacementChallenges);
    allChallenges = allChallenges.concat(sessionData.adaptiveInterleavedChallenges);
    return allChallenges;
}

// Import challenge data from a JSON file and return as TSV rows
function makeFlashcardsForSession(jsonFilePath: string, sourceDesc: string, teachingObjective: string): Note[] {
    console.debug('Importing from ' + jsonFilePath);
    let sessionData: any = {};
    try {
        sessionData = readJsonFromFile(jsonFilePath); // JSON.parse(fileContent);
    } catch (e) {
        console.error(`Error while trying to read: ${jsonFilePath}`, e);
        return [];
    }
    let notes: Note[] = [];
    ////let tsvRows: string[] = [];
    let allChallenges = getChallenges(sessionData);
    for (let challenge of allChallenges) {
        if (challenge) {
            //let isHard = challenge.metadata?.indicator_type?.name == 'HARD_CHALLENGE';
            if (challenge?.type === 'translate') {
                let isReverse = challenge.metadata.specific_type === 'reverse_tap';
                let textLang1 = challenge.prompt;
                let textLang2 = challenge.metadata?.challenge_construction_insights?.best_solution;
                let transliteration = "";
                let transliterations: any = isReverse ? (challenge?.correctSolutionTransliterations?.[0]) : (challenge?.promptTransliteration);
                if (transliterations) {
                    for (let token of transliterations.tokens) {
                        for (let text of token.transliterationTexts) {
                            if (text.type != 'pinyin') {
                                console.error('Warning: Found non-pinyin: type=' + text.type + ', text=' + text.text);
                            } else {
                                if (/*text.text == '' && */token.token=="、") {
                                    transliteration += text.text + ", ";
                                } else {
                                    transliteration += text.text + " ";
                                }
                            }
                        }
                        transliteration = transliteration.replaceAll(" ,", ",");
                    }
                } else if (jsonFilePath.includes("DUOLINGO_AR_EN")) {
                    let arabicText = isReverse ? textLang2 : textLang1;
                    //transliteration = arabictransliterate(arabicText, "arabic2latin", "Arabic");
                    transliteration = transliterateArabic(arabicText);
                } else if (CURRENT_COURSE == LANGUAGE_COURSES.HINDI_ENGLISH) {
                    let hindiText = isReverse ? textLang2 : textLang1;
                    //transliteration = arabictransliterate(arabicText, "arabic2latin", "Arabic");
                    transliteration = transliterateHindi(hindiText);
                } else {
                    transliteration = "-"; // Arabic doesn't have transliteration, at least for translate:tap
                }
                let note: Note = {
                    //id: 'TODO',
                    context: teachingObjective,
                    english: isReverse ? textLang1 : textLang2,
                    foreign: isReverse ? textLang2 : textLang1,
                    transliteration: transliteration,
                    sources: 'Duo', // sourceDesc + 'Translate ' + (isReverse ? 'from English' : 'to English'),
                    tip: '-', // isHard ? 'HARD' : '-', // sourceDesc + 'Translate ' + (isReverse ? 'from English' : 'to English'),
                    debug: `type=${challenge?.type}:${challenge.metadata.specific_type}`, // isHard ? 'HARD' : '-', // sourceDesc + 'Translate ' + (isReverse ? 'from English' : 'to English'),
                };
                let row = noteToTsvRow(note);
                notes.push(note);
                ////tsvRows.push(row);
            } else if (challenge?.type === 'select') {
                if  (challenge.metadata.specific_type == 'name_example') {
                    let isReverse = false; // TODO: How to do this?
                    let correctChoice = challenge.choices[challenge.correctIndex];
                    let textLang1 = challenge.prompt; // or challenge.metadata.hint // English
                    let textLang2 = correctChoice.phrase; // or challenge.metadata?.challenge_construction_insights?.best_solution; // or metadata.phrase
                    let transliteration = "";
                    let transliterations = correctChoice.phraseTransliteration;
                    if (transliterations) {
                        for (let token of transliterations.tokens) {
                            for (let text of token.transliterationTexts) {
                                if (text.type != 'pinyin') {
                                    console.error('Warning: Found non-pinyin: type=' + text.type + ', text=' + text.text);
                                } else {
                                    if (token.token=="、") { // && text.text == ''
                                        transliteration += text.text + ", ";
                                    } else {
                                        transliteration += text.text + " ";
                                    }
                                }
                            }
                            transliteration = transliteration.replaceAll(" ,", ",");
                        }
                    } else if (jsonFilePath.includes("DUOLINGO_AR_EN")) {
                        let arabicText = isReverse ? textLang1 : textLang2;
                        transliteration = transliterateArabic(arabicText);
                    } else if (CURRENT_COURSE == LANGUAGE_COURSES.HINDI_ENGLISH) {
                        let hindiText = isReverse ? textLang1 : textLang2;
                        transliteration = transliterateHindi(hindiText);
                    } else {
                        transliteration = "-"; // Arabic doesn't have transliteration, at least for translate:tap
                    }
                    let note: Note = {
                        //id: 'TODO',
                        context: teachingObjective,
                        english: textLang1,
                        foreign: textLang2,
                        transliteration: transliteration,
                        sources: 'Duo', // sourceDesc + 'Translate ' + (isReverse ? 'from English' : 'to English'),
                        tip: '-',
                        debug: `type=${challenge?.type}:${challenge.metadata.specific_type}`, // isHard ? 'HARD' : '-', // sourceDesc + 'Translate ' + (isReverse ? 'from English' : 'to English'),
                    };
                    let row = noteToTsvRow(note);
                    notes.push(note);
                    ////tsvRows.push(row);

                } else {
                    console.error(`For challenge type=select, unrecognized specific_type=${challenge.metadata.specific_type}`);
                }
            }

        }
    }
    return notes;
    ////return tsvRows;
}


// TOP LEVEL FUNCTION
function makeSentenceFlashcards() {

    ////let combinedTsvRows: string[] = [];
    let tsvRows: string[] = [];
    let headerRow: string = NOTE_TSV_HEADERS.join('\t');
    tsvRows.push(headerRow);

    // Read course data
    let courseFilename = FM.getCourseJsonFilename();
    let user = readJsonFromFile(courseFilename) as any;
    let courseData = user.currentCourse;

    let combinedNotes: Note[] = [];
    // Read session files
    for (let section of courseData.pathSectioned) {
        for (let unit of section.units) {
            let sourceDesc = `DuoLingo: Section ${section.index+1}, Unit ${unit.unitIndex+1}: ${unit.teachingObjective}`;
            for (let levelIndex = 0; levelIndex < unit.levels.length; levelIndex++) {
                let level = unit.levels[levelIndex]!;
                if (level.type === 'skill') {
                    for (let sessionIndex = 0; sessionIndex < level.totalSessions; sessionIndex++) {
                        let sessionFile = FM.getSessionFilename(
                            section.index, unit.unitIndex, levelIndex, sessionIndex
                        );
                        let notes: Note[] = makeFlashcardsForSession(sessionFile, sourceDesc, unit.teachingObjective);
                        combinedNotes = combinedNotes.concat(notes);
                        ////let tsvRows: string[] = makeFlashcardsForSession(sessionFile, sourceDesc, unit.teachingObjective);
                        ////combinedTsvRows = combinedTsvRows.concat(tsvRows);
                    };
                }
            }
        };
    };

    // dedupe (for Arabic, this reduces notes from 2893 down to 739)
    combinedNotes = dedupe(combinedNotes);

    // Save tsvRows to a TSV file
    for (let note of combinedNotes) {
        let row = noteToTsvRow(note);
        tsvRows.push(row);
    }
    const tsvContent = tsvRows.join('\n');
    ////const tsvContent = combinedTsvRows.join('\n');
    let flashcardsFile = FM.getSentenceFlashcardsTsvFilename();
    writeStringToFile(tsvContent, flashcardsFile);
}

function dedupe(notes: Note[]): Note[] {
    let deduped: Note[] = [];
    let seen = new Set<string>();
    for (let note of notes) {
        let key = note.foreign + "|" + note.english;
        if (!seen.has(key)) {
            deduped.push(note);
            seen.add(key); 
        }
    }
    return deduped;
}

// TOP LEVEL FUNCTION
function makeLexemeFlashcards() {
    let tsvRows: string[] = [];
    let headerRow: string = NOTE_TSV_HEADERS.join('\t');
    tsvRows.push(headerRow);

    // Read lexemes data
    let lexemesFilename = FM.getLexemesJsonFilename();
    let lexemes = readJsonFromFile(lexemesFilename) as LearnedLexeme[];
    let notes: Note[] = [];
    for (let lexeme of lexemes) {
        let note: Note = {
            //id: 'TODO',
            context: 'lexeme',
            english: lexeme.translations.join('; '),
            foreign: lexeme.text,
            transliteration: '-',
            sources: 'Duo', // sourceDesc + 'Translate ' + (isReverse ? 'from English' : 'to English'),
            tip: '-',
            debug: '-'
        };
        if (CURRENT_COURSE.learningLanguage == 'ar') {
            note.transliteration = transliterateArabic(lexeme.text);
        } else if (CURRENT_COURSE.learningLanguage == 'hi') {
            note.transliteration = transliterateHindi(lexeme.text);
        }
        notes.push(note);
    }
    notes = dedupe(notes);
    for (let note of notes) {
        let row = noteToTsvRow(note);
        tsvRows.push(row);
    }
    // eliminate duplicates
    // Save tsvRows to a TSV file
    const tsvContent = tsvRows.join('\n');
    let flashcardsFile = FM.getLexemeFlashcardsTsvFilename();
    writeStringToFile(tsvContent, flashcardsFile);
}

makeLexemeFlashcards();

makeSentenceFlashcards();
