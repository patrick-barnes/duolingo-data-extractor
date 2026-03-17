import { transformArrayToMarkdown } from './markdown-transformer.js';
import { FM, readJsonFromFile, writeStringToFile } from './file-util.js';

const data: any = readJsonFromFile(FM.getAllCoursesJsonFilename());
const markdown: string = transformArrayToMarkdown(data.courses);
writeStringToFile(markdown, FM.getAllCoursesMarkdownFilename());
