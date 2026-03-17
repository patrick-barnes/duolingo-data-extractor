import { AIRLEARN_CURRENT_GOAL } from "../config.js";
import type { Script, Word } from "../model/words.js";
import { getLexemeFlashcardsTsvFilename, getV1ContentWordsJsonFilenameByCourseIdGeneric, readJsonFromFile, writeStringToFile } from "../util/file-util.js";

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

function extractHighlightInnerHtml(highlightedText: string): string {
    // Example input: "<highlight ...>​​软件</highlight> (ruǎnjiàn)"
    // Desired output: "​​软件"
    return highlightedText.replace(/<highlight[^>]*>(.*?)<\/highlight>.*/g, '$1');
}

function extractPronuncationInner(pronunciationOuter: string): string {
    // Example input: "[ruǎnjiàn]"
    // Desired output: "​​ruǎnjiàn"
    return pronunciationOuter.replace(/^\[(.*?)\]$/, '$1');
}

function extractScriptTexts(script: Script[]): string {
    // Example input: [{ "pronunciation": "Ruǎn", "text": "​​软" }, { "pronunciation": "jiàn", "text": "件" }]
    // Desired output: "​​软件"
    if (script === null) {
        return '';
    }
    return script.map(s => s.text).join('');
}

function extractScriptPronunciations(script: Script[]): string {
    // Example input: [{ "pronunciation": "Ruǎn", "text": "​​软" }, { "pronunciation": "jiàn", "text": "件" }]
    // Desired output: "​​ruǎnjiàn"
    if (script === null) {
        return '';
    }
    return script.map(s => s.pronunciation).join('').toLowerCase();
}

function makeFlashCards(words: Word[]): Note[] {
    let notes: Note[] = [];
    for (let word of words) {
        let script1 = extractHighlightInnerHtml(word.text);
        let script2 = extractScriptTexts(word.script);
        if (script1 !== script2) {
            //console.warn(`Script mismatch for word ${word.text}: extracted from text="${script1}", extracted from script="${script2}"`);
        }
        let pronuncation1 = extractPronuncationInner(word.pronounciation);
        let pronuncation2 = extractScriptPronunciations(word.script);
        if (pronuncation1 !== pronuncation2) {
            //console.warn(`Pronunciation mismatch for word ${word.text}: extracted from pronounciation="${pronuncation1}", extracted from script="${pronuncation2}"`);
        }
        let note: Note = {
            //id: string;
            english: word.meaning,
            context: "",
            foreign: script1,
            transliteration: pronuncation1,
            tip: "",
            sources: "", // "AirLearn",
            debug: "",
        };      
        notes.push(note);
    }
    return notes;
}

function saveFlashCardsToTsv(notes: Note[], filename: string) {
    let tsvRows: string[] = [];
    let headerRow: string = NOTE_TSV_HEADERS.join('\t');
    tsvRows.push(headerRow);
    for (let note of notes) {
        let row = noteToTsvRow(note);
        tsvRows.push(row);
    }
    const tsvContent = tsvRows.join('\n');
    writeStringToFile(tsvContent, filename);
}

let goalUID = AIRLEARN_CURRENT_GOAL.goalUID;
let wordsJsonFilename = getV1ContentWordsJsonFilenameByCourseIdGeneric(goalUID);
let wordsFlashcardsJsonFilename = getLexemeFlashcardsTsvFilename(goalUID);
let words: Word[] = readJsonFromFile(wordsJsonFilename);
let notes: Note[] = makeFlashCards(words);
saveFlashCardsToTsv(notes, wordsFlashcardsJsonFilename);
