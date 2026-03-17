import { readJsonFromFile, writeStringToFile, FM } from './file-util.js';
import { type LanguageCourse } from './model/courses.js';
import { CURRENT_COURSE, keysToIgnore } from './config.js';

function getFlattenedKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = [];
    if (Array.isArray(obj)) {
        // skip array for now
    } else {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    keys = keys.concat(getFlattenedKeys(obj[key], fullKey));
                } else {
                    keys.push(fullKey);
                }
            }
        }
    }
    return keys;
}

function getValueByFlattenedKey(obj: any, flattenedKey: string): any {
  return flattenedKey
    .replace(/\[(\d+)\]/g, '.$1') // Convert array indices to dot notation
    .split('.')
    .reduce((acc, key) => acc && acc[key], obj);
}

function normalizeString(str: string): string {
    if (str.startsWith('https://')) {
        return 'https://x.y/z';
    }
    return str;
}

function isChallengeTypeInScope(type: string): boolean {
    if (type === 'match' || type === 'dialogue' || type === 'svgPuzzle' || type === 'characterWrite') {
        return false;
    }
    return true;
}

// helper function
function getChallenges(sessionData: any): any[] {
    let allChallenges: any[] = [];
    allChallenges = allChallenges.concat(sessionData.challenges);
    allChallenges = allChallenges.concat(sessionData.adaptiveChallenges);
    allChallenges = allChallenges.concat(sessionData.mistakesReplacementChallenges);
    allChallenges = allChallenges.concat(sessionData.adaptiveInterleavedChallenges);
    return allChallenges;
}

// helper function
function findFlattenedKeys(jsonFilePath: string): Set<string> {
    let sessionData: any = readJsonFromFile(jsonFilePath); //  JSON.parse(fileContent);

    let allFlattenedKeys: Set<string> = new Set();

    let allChallenges = getChallenges(sessionData);
    for (let challenge of allChallenges) {
        if (isChallengeTypeInScope(challenge?.type)) {
            let flattenedKeys = getFlattenedKeys(challenge);
            flattenedKeys.forEach(k => allFlattenedKeys.add(k));
        }
    }

    // remove keys to ignore
    keysToIgnore.forEach(k => allFlattenedKeys.delete(k));

    return allFlattenedKeys;
}

// Helper function: Import challenge data from a JSON file and return as TSV rows
function importChallengeData(jsonFilePath: string, keysArray: string[]): string[] {
    let sessionData: any = readJsonFromFile(jsonFilePath); // JSON.parse(fileContent);
    let tsvRows: string[] = [];
    let allChallenges = getChallenges(sessionData);
    for (let challenge of allChallenges) {
        if (isChallengeTypeInScope(challenge?.type)) {
            let values: string[] = [];
            for (let key of keysArray) {
                let value = getValueByFlattenedKey(challenge, key);
                value = typeof value === 'string' ? normalizeString(value) : value;
                values.push(value !== undefined ? String(value).replace(/\t/g, ' ') : '');
            }
            let row = values.join('\t');
            tsvRows.push(row);
        }
    }
    return tsvRows;
}

// TOP LEVEL FUNCTION
// Explore session data and dump list of challenge keys and challenges
function exploreSessionData() {
    let inputSessionFiles: string[] = FM.getSessionFilenames();

    let allKeys: Set<string> = new Set();
    for (let jsonFilePath of inputSessionFiles) {
        let keys = findFlattenedKeys(jsonFilePath);
        allKeys = new Set([...allKeys, ...keys]);
    }
    let keysArray = Array.from(allKeys).sort();

    // save keysArray to a JSON file
    let keysArrayJson = JSON.stringify(keysArray, null, 2);
    writeStringToFile(keysArrayJson, FM.getExploreChallengeKeysJsonFilename());

    let combinedTsvRows: string[] = [];
    let headerRow: string = keysArray.join('\t');
    combinedTsvRows.push(headerRow);

    for (let jsonFilePath of inputSessionFiles) {
        let tsvRows: string[] = importChallengeData(jsonFilePath, keysArray);
        combinedTsvRows = combinedTsvRows.concat(tsvRows);
    }

    // Save tsvRows to a TSV file
    const tsvContent = combinedTsvRows.join('\n');
    
    writeStringToFile(tsvContent, FM.getExploreChallengesTsvFilename());
}


// TOP LEVEL FUNCTION
// Explore course data and write metadata files like levels and skills
function exploreCourseMetadata() {
    let inputJsonFile = FM.getCourseJsonFilename();
    let outputLevelsTsvFile = FM.getExploreLevelsTsvFilename();
    let outputSkillsTsvFile = FM.getExploreSkillsTsvFilename();

    let currentCourseRoot: any = readJsonFromFile(inputJsonFile);
    let levelColumnNames = [
        "pathId",
        "pathDebugName",
        "unitIndex",
        "unitTeachingObjective",
        "levelId",
        "levelDebugName",
        "skillId"
    ];
    let levelsTsvRows: string[] = [];
    let levelsHeaderRow: string = levelColumnNames.join('\t');
    levelsTsvRows.push(levelsHeaderRow);
    for (let path of currentCourseRoot.currentCourse.pathSectioned) {
        for (let unit of path.units) {
            for (let level of unit.levels) {
                let columnValues = [
                    path.id, // pathId
                    path.debugName, // pathDebugName
                    unit.unitIndex, // unitIndex
                    unit.teachingObjective, // unitTeachingObjective
                    level.id, // levelId
                    level.debugName, // levelDebugName
                    level.pathLevelMetadata.skillId // skillId
                ];
                let row = columnValues.join('\t');
                levelsTsvRows.push(row);
            }
        }
    }
    const levelsTsvContent = levelsTsvRows.join('\n');
    writeStringToFile(levelsTsvContent, outputLevelsTsvFile);

    // SKILLS TSV
    let skillColumnNames = [
        "skillId",
        "skillType",
        "skillName",
        "skillShortName",
        "explanationTitle",
    ];
    let skillsTsvRows: string[] = [];
    let skillsHeaderRow: string = skillColumnNames.join('\t');
    skillsTsvRows.push(skillsHeaderRow);
    currentCourseRoot.currentCourse.skills.forEach((skillSection: any) => {
        skillSection.forEach((skill: any, i2: number) => {
            let columnValues = [
                skill.id, // skillId
                skill.skillType, // skillType
                skill.name, // skillName
                skill.shortName, // skillShortName
                skill.explanation?.title, // skillExplanationTitle
            ];
            let row = columnValues.join('\t');
            skillsTsvRows.push(row);
        });
    });
    const skillTsvContent = skillsTsvRows.join('\n');
    writeStringToFile(skillTsvContent, outputSkillsTsvFile);
}

exploreCourseMetadata();

exploreSessionData();
