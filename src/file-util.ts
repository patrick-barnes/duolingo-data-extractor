import * as fs from 'fs';
import * as path from 'path';
import { LANGUAGE_COURSES, type LanguageCourse } from './model/courses.js';
import { CURRENT_COURSE } from './config.js';

export function writeStringToFile(s: string, filename: string): void {
    console.log('Writing to file: ' + filename);
    let folder = path.dirname(filename);
    console.debug("- folder=" + folder);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(filename, s, 'utf-8');
    console.log('Wrote ' + s.length + ' characters to: ' + filename);
}

export function readJsonFromFile(filename: string): any {
    console.log('Importing JSON data from: ' + filename);
    const fileContent = fs.readFileSync(filename, 'utf-8');
    console.log('Read ' + fileContent.length + ' characters from: ' + filename);
    const data = JSON.parse(fileContent);
    console.log('Parsed JSON data from: ' + filename);
    return data;
}

// helper
function getLanguageCourseByCourseId(courseId: string): LanguageCourse | undefined {
    for (let courseName of Object.keys(LANGUAGE_COURSES)) {
        let languageCourse: LanguageCourse = LANGUAGE_COURSES[courseName]!;
        if (languageCourse.courseId == courseId) {
            return languageCourse;
        }
    }
    return undefined;
}

export function getCourseJsonFilenameByCourseId(courseId: string): string {
    console.info(`Determining course json filename by courseId=${courseId}`);
    let languageCourse = getLanguageCourseByCourseId(courseId);
    if (!languageCourse) {
        throw "Unsupported courseId: " + courseId;
    }
    console.info(`Found LanguageCourse, commonFolderName=${languageCourse.commonFolderName}`);
    return `output/${languageCourse.commonFolderName}/course.json`;
}

// Folder structure:
// =================
// output/L-F/course.json
// output/L-F/sessions/sessions.n.n.n.n.json
// output/L-F/explore/levels.tsv
// output/L-F/explore/skills.tsv
// output/L-F/explore/challenges.tsv
// output/L-F/explore/challenge-keys.json

export class FileManager {

    constructor() {
    }

    getSessionFilenames() {
        let sessionsFolder = `output/${CURRENT_COURSE.commonFolderName}/sessions`;
        let sessionFilenames: string[] = [];
        const filenames = fs.readdirSync(sessionsFolder);
        for (let filename of filenames) {
            const fullPath = `${sessionsFolder}/${filename}`;
            if (fs.statSync(fullPath).isFile()) {
                sessionFilenames.push(fullPath);
            }
        }
        return sessionFilenames;
    }

    getSessionFilename(
        sectionIndex: number,
        unitIndex: number,
        levelIndex: number,
        sessionIndex: number
    ) {
        return `output/${CURRENT_COURSE.commonFolderName}/sessions/sessions.${sectionIndex}.${unitIndex}.${levelIndex}.${sessionIndex}.json`;
    }

    getAllCoursesJsonFilename() {
        return `output/all-courses.json`;
    }

    getAllCoursesMarkdownFilename() {
        return `output/all-courses.md`;
    }

    getCourseJsonFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/course.json`;
    }

    getExploreLevelsTsvFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/explore/levels.tsv`;
    }

    getExploreSkillsTsvFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/explore/skills.tsv`;
    }

    getExploreChallengeKeysJsonFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/explore/challenge-keys.json`;
    }

    getExploreChallengesTsvFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/explore/challenges.tsv`;
    }

    getSentenceFlashcardsTsvFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/flashcards/sentence-flashcards.tsv`;
    }

    getLexemesJsonFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/lexemes/lexemes.json`;
    }

    getLexemeFlashcardsTsvFilename() {
        return `output/${CURRENT_COURSE.commonFolderName}/flashcards/lexeme-flashcards.tsv`;
    }

};

export const FM = new FileManager();
