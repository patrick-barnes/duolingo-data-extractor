import type { GetSessionRequest } from "../model/session.js";
import type { User, Course } from "../model/user.js";
import { FM, getCourseJsonFilenameByCourseId, writeStringToFile } from "../file-util.js";
import { ALL_CHALLENGE_TYPES } from "./all-challenge-types.js";
import type { GetLearnedLexemesRequest, GetLearnedLexemesResponse, LearnedLexeme, ProgressedSkill } from "../model/lexemes.js";
import { JWT, USER_ID } from "../config.js";

const BASE_URL = 'https://www.duolingo.com/2017-06-30';

// Wait in between API calls to avoid rate limiting
const WAIT_MILLIS = 1000;
//const MAX_SESSIONS_FILES = 9999;

export class APIClient {

	constructor() {
	}

	// common
	async doPost(path: string, payload: any): Promise<any> {
        // Wait in between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, WAIT_MILLIS));
        let url = `${BASE_URL}/${path}`;
        console.log(`Calling POST ${url}`);
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JWT}`,
			},
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
            console.log(`Error while calling POST ${url}`, response);
			throw new Error(`HTTP ${response.status}: ${await response.text()}`);
		}
        console.log(`OK from calling POST ${url}`); // , response
		return response.json();
	}

	// common
	async doGet(path: string): Promise<any> {
        // Wait in between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, WAIT_MILLIS));
        let url = `${BASE_URL}/${path}`;
        console.log(`Calling GET ${url}`);
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${JWT}`,
			},
		});
		if (!response.ok) {
            console.log(`Error while calling GET ${url}`, response);
			throw new Error(`HTTP ${response.status}: ${await response.text()}`);
		}
        console.log(`OK from calling GET ${url}`); // , response
		return response.json();
	}

	// endpoint-specific
    async getSessions(payload: GetSessionRequest): Promise<any> {
		console.info('getSessions() called');
        return await this.doPost('sessions', payload);
    }

	// endpoint-specific
	async getLearnedLexemes(
			learningLanguage: string, // "hi"
			fromLanguage: string, // "en"
			limit: number, // 50
			startIndex: number, // 0, 50, 100...
			payload: GetLearnedLexemesRequest
	): Promise<GetLearnedLexemesResponse> {
		let sortBy = 'LEARNED_DATE'; // 'ALPHABETICAL';
		let url = `users/${USER_ID}/courses/${learningLanguage}/${fromLanguage}/learned-lexemes` +
			`?limit=${limit}` +
			`&sortBy=${sortBy}` +
			`&startIndex=${startIndex}`;
		console.info('getLearnedLexemes() called');
		return await this.doPost(url, payload);
	}

	// STEP 1: FETCH CURRENT COURSE. This will give us:
	// - The course ID, e.g. "DUOLINGO_AR_EN"
	// - The learning language and from language
	// - The Skill Tree ID
	// - The Sections, Levels, Skills, and number of sessions per skill
	// Fetch "current course" from DuoLingo API and save to JSON file
	async fetchAndSaveCurrentCourse() {
	  console.info('fetchAndSaveCurrentCourse() called');
	  let ts = Date.now();
	  let path = `users/${USER_ID}?fields=currentCourse&_=${ts}`;
	  let user: User = await this.doGet(path) as User;
	  let courseId = user.currentCourse.id; // "DUOLINGO_AR_EN"
	  let userJson = JSON.stringify(user, null, 2);
	  let userFilename = getCourseJsonFilenameByCourseId(courseId);
	  writeStringToFile(userJson, userFilename);
	}

	async fetchAndSaveSessions(course: Course, minUnitIndex: number, maxUnitIndex: number) {
		// let currentCourse: CurrentCourse = user.currentCourse;
		//let numSessionsFilesWritten = 0;
	  	console.info('fetchAndSaveSessions() called');
		let treeId = course.treeId; // "4c2844de4f4c587f943c9f65b9009567"
		let learningLanguage = course.learningLanguage; // "ar"
		let fromLanguage = course.fromLanguage; // "en"
		let courseId = course.id; // "DUOLINGO_AR_EN"
		for (let section of course.pathSectioned) {
			console.log();
			for (let unit of section.units) {
				if (unit.unitIndex >= minUnitIndex && unit.unitIndex <= maxUnitIndex) {
					console.log();
					console.log(`# ${section.index + 1}.${unit.unitIndex + 1}: ${unit.teachingObjective}`);
					let skillIdSet: Set<string> = new Set();
					for (let level of unit.levels) {
						if (level.type === 'skill') {
							if (level.pathLevelMetadata?.skillId) {
								skillIdSet.add(level.pathLevelMetadata.skillId);
							}
						}
					};
					let skillIds = Array.from(skillIdSet);
					for (let levelIndex = 0; levelIndex < unit.levels.length; levelIndex++) {
						let level = unit.levels[levelIndex]!;
						if (level.type === 'skill') {
							console.log(`- ${level.id + 1}: ${level.debugName}`);
							for (let sessionIndex = 0; sessionIndex < level.totalSessions; sessionIndex++) {
								let req: GetSessionRequest = {
									learningLanguage: learningLanguage,
									fromLanguage: fromLanguage,
									treeId: treeId,
									levelIndex: levelIndex,
									levelSessionIndex: sessionIndex,
									skillIds: skillIds,
									type: "LEXEME_SKILL_LEVEL_PRACTICE",
									challengeTypes: ALL_CHALLENGE_TYPES,
									isFinalLevel: false,
									isV2: true,
									juicy: true,
									shakeToReportEnabled: true,
									pathExperiments: [
										"BACKEND_REACTIVATION_REVIEW_NODE_ANDROID",
										"BACKEND_REACTIVATION_REVIEW_NODE_IOS",
										"BACKEND_RESURRECTION_REVIEW_NODE_ANDROID",
										"BACKEND_RESURRECTION_REVIEW_NODE_IOS"
									]
								};
								let sessions = await this.getSessions(req);
								let sessionsJson = JSON.stringify(sessions, null, 2);
								let sessionsFilename = FM.getSessionFilename(section.index, unit.unitIndex, levelIndex, sessionIndex);
								writeStringToFile(sessionsJson, sessionsFilename);
							}
						}
					}
				}
			}
		}
	}

	// utility method
	incrementSkill(skillMap: Map<string, ProgressedSkill>, skillId: string, numLevels: number, numSessions: number) {
		let progressedSkill: ProgressedSkill | undefined = skillMap.get(skillId);
		if (!progressedSkill) {
			progressedSkill = {
				finishedLevels: 0,
				finishedSessions: 0,
				skillId: {
					id: skillId
				}
			};
			skillMap.set(skillId, progressedSkill);
		}
		progressedSkill.finishedLevels += numLevels;
		progressedSkill.finishedSessions += numSessions;
	}

	async fetchAndSaveLearnedLexemes(course: Course, pageSize: number, maxPages: number) {
		console.info('fetchAndSaveLearnedLexemes() called');
		//let treeId = course.treeId; // "4c2844de4f4c587f943c9f65b9009567"
		let learningLanguage = course.learningLanguage; // "ar"
		let fromLanguage = course.fromLanguage; // "en"
		let skillMap: Map<string, ProgressedSkill> = new Map();
		for (let section of course.pathSectioned) {
			console.log();
			for (let unit of section.units) {
				console.log();
				console.log(`# ${section.index + 1}.${unit.unitIndex + 1}: ${unit.teachingObjective}`);
				for (let level of unit.levels) {
					if (level.type === 'skill') {
						let skillId = level.pathLevelMetadata?.skillId;
						if (skillId) {
							this.incrementSkill(skillMap, skillId, 1, level.totalSessions);
						}
					}
				};
			}
		}
		let req: GetLearnedLexemesRequest = {
			lastTotalLexemeCount: 0,
			progressedSkills: Array.from(skillMap.values())
		};
		let numPagesFetched = 0;
		let startIndex = 0;
		let allLearnedLexemes: LearnedLexeme[] = [];
		while (numPagesFetched < maxPages && startIndex != null) {
			let res: GetLearnedLexemesResponse = await this.getLearnedLexemes(learningLanguage, fromLanguage, pageSize, startIndex, req);
			allLearnedLexemes.push(...res.learnedLexemes);
			numPagesFetched++;
			startIndex = res.pagination.nextStartIndex;
		}
		// Normal order = "most recently learned"
    	// Reverse order = "the order in which you learned it" 
		allLearnedLexemes.reverse();
		// save combined file
		let lexemesJson = JSON.stringify(allLearnedLexemes, null, 2);
		let lexemesJsonFilename = FM.getLexemesJsonFilename();
		writeStringToFile(lexemesJson, lexemesJsonFilename);
	}

}
