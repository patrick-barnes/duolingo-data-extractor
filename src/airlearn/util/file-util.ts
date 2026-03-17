import * as fs from 'fs';
import * as path from 'path';
import { AIRLEARN_GOALS, type AirLearnGoal } from '../model/goals.js';
import { AIRLEARN_CURRENT_GOAL } from '../config.js';

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
function getAirLearnGoalByGoalUID(goalUID: string): AirLearnGoal | undefined {
    for (let goalUID of Object.keys(AIRLEARN_GOALS)) {
        let airLearnGoal: AirLearnGoal = AIRLEARN_GOALS[goalUID]!;
        if (airLearnGoal.goalUID == goalUID) {
            return airLearnGoal;
        }
    }
    return undefined;
}

export function getV1ContentWordsJsonFilenameByCourseIdGeneric(goalUID: string): string {
    console.info(`Determining json filename by goalUID=${goalUID}`);
    let airLearnGoal = getAirLearnGoalByGoalUID(goalUID);
    if (!airLearnGoal) {
        throw "Unsupported goalUID: " + goalUID;
    }
    console.info(`Found AirLearnGoal, commonFolderName=${airLearnGoal.commonFolderName}`);
    return `output-airlearn/${airLearnGoal.commonFolderName}/words.json`;
}

export function getV1ContentWordsJsonFilenameByCourseIdGranular(
    goalUID: string, limit: number, offset: number, order: number, isImportant: number
): string {
    console.info(`Determining json filename by goalUID=${goalUID}`);
    let airLearnGoal = getAirLearnGoalByGoalUID(goalUID);
    if (!airLearnGoal) {
        throw "Unsupported goalUID: " + goalUID;
    }
    console.info(`Found AirLearnGoal, commonFolderName=${airLearnGoal.commonFolderName}`);
    let startIndex = offset;
    let endIndex = offset + limit - 1;
    let orderStr = order == 1 ? "recent" : "a-z";
    let importantStr = isImportant ? "starred" : "all";
    return `output-airlearn/${airLearnGoal.commonFolderName}/get.v1.content.words.${startIndex}-${endIndex}.${orderStr}.${importantStr}.json`;
}

export function getLexemeFlashcardsTsvFilename(goalUID: string) {
    let airLearnGoal = getAirLearnGoalByGoalUID(goalUID);
    if (!airLearnGoal) {
        throw "Unsupported goalUID: " + goalUID;
    }
    return `output-airlearn/${airLearnGoal.commonFolderName}/flashcards/lexeme-flashcards.tsv`;
}


// Folder structure:
// =================
// output/L-F/course.json
// output/L-F/sessions/sessions.n.n.n.n.json
// output/L-F/explore/levels.tsv
// output/L-F/explore/skills.tsv
// output/L-F/explore/challenges.tsv
// output/L-F/explore/challenge-keys.json

/*
export class FileManager {

    private goal!: AirLearnGoal; // = CURRENT_COURSE;

    constructor(goal: AirLearnGoal) {
        this.goal = goal;
    }

    getSessionFilenames() {
        let sessionsFolder = `output/${this.course.commonFolderName}/sessions`;
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
        return `output/${this.course.commonFolderName}/sessions/sessions.${sectionIndex}.${unitIndex}.${levelIndex}.${sessionIndex}.json`;
    }

    getAllCoursesJsonFilename() {
        // originally 'data/chinese-or-generic/user.courses.json'
        return `output/all-courses.json`;
    }

    getAllCoursesMarkdownFilename() {
        return `output/all-courses.md`;
    }

    getCourseJsonFilename() {
        return `output/${this.course.commonFolderName}/course.json`;
    }

    getExploreLevelsTsvFilename() {
        return `output/${this.course.commonFolderName}/explore/levels.tsv`;
    }

    getExploreSkillsTsvFilename() {
        return `output/${this.course.commonFolderName}/explore/skills.tsv`;
    }

    getExploreChallengeKeysJsonFilename() {
        return `output/${this.course.commonFolderName}/explore/challenge-keys.json`;
    }

    getExploreChallengesTsvFilename() {
        return `output/${this.course.commonFolderName}/explore/challenges.tsv`;
    }

    getSentenceFlashcardsTsvFilename() {
        return `output/${this.course.commonFolderName}/flashcards/sentence-flashcards.tsv`;
    }

    getLexemesJsonFilename() {
        return `output/${this.course.commonFolderName}/lexemes/lexemes.json`;
    }

    getLexemeFlashcardsTsvFilename() {
        return `output/${this.course.commonFolderName}/flashcards/lexeme-flashcards.tsv`;
    }

};

export const FM = new FileManager(AIRLEARN_CURRENT_GOAL);
*/
