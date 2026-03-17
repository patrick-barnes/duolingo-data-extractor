import { APIClient } from "./api-client/api-client.js";
import { CURRENT_COURSE } from "./config.js";
import { FM, readJsonFromFile } from "./file-util.js";

// get course data
let courseJsonFilename = FM.getCourseJsonFilename();
let user = readJsonFromFile(courseJsonFilename) as any;
let course = user.currentCourse;

let apiClient: APIClient = new APIClient();
apiClient.fetchAndSaveSessions(course, 0, 9999);
