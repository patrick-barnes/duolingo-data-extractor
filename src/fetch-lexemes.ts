import { APIClient } from "./api-client/api-client.js";
import { FM, readJsonFromFile } from "./file-util.js";

// get course data
let courseFile = FM.getCourseJsonFilename();
let user = readJsonFromFile(courseFile) as any;
let course = user.currentCourse;

// fetch learned lexemes data
let apiClient: APIClient = new APIClient();
let pageSize = 1000; // app default
apiClient.fetchAndSaveLearnedLexemes(course, pageSize, 9999);
