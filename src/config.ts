import { LANGUAGE_COURSES } from "./model/courses.js";

// .env should set USER_ID
export const USER_ID = process.env.USER_ID || '';
if (!USER_ID) {
	throw new Error('USER_ID environment variable is not set');
}

// .env should set JWT
export const JWT = process.env.JWT || '';
if (!JWT) {
	throw new Error('JWT environment variable is not set');
}

// .env should set COURSE_NAME
const COURSE_NAME = process.env.COURSE_NAME!;
if (!COURSE_NAME) {
    throw new Error('COURSE_NAME environment variable is not set');
}
export const CURRENT_COURSE = LANGUAGE_COURSES[COURSE_NAME]!;
if (!CURRENT_COURSE) {
    throw new Error(`COURSE_NAME "${COURSE_NAME}" is invalid. It must be one of:\n` +
        Object.keys(LANGUAGE_COURSES).join('\n'));
}
