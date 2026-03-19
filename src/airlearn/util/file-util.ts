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
    return AIRLEARN_GOALS[goalUID]!;
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
    return `output-airlearn/${airLearnGoal.commonFolderName}/get.v1.content.words.${importantStr}.${orderStr}.${startIndex}-${endIndex}.json`;
}

export function getLexemeFlashcardsTsvFilename(goalUID: string) {
    let airLearnGoal = getAirLearnGoalByGoalUID(goalUID);
    if (!airLearnGoal) {
        throw "Unsupported goalUID: " + goalUID;
    }
    return `output-airlearn/${airLearnGoal.commonFolderName}/flashcards/lexeme-flashcards.tsv`;
}
