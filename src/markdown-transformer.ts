export function transformArrayToMarkdown(arr: any[]): string {
  if (!Array.isArray(arr) || arr.length === 0) return 'No data.';
  const headers = Object.keys(arr[0]);
  const headerRow = '| ' + headers.join(' | ') + ' |';
  const separatorRow = '| ' + headers.map(() => '---').join(' | ') + ' |';
  const rows = arr.map(obj => {
    return '| ' + headers.map(h => String(obj[h] ?? '')).join(' | ') + ' |';
  });
  return [headerRow, separatorRow, ...rows].join('\n');
}

/*
// super lazy utility method when you don't want to
// even identify which top-level property has the array
function objectToMarkdownTable(obj: any): string {
    // Try to find a top-level array, or use a known property
    let markdown = '';
    if (Array.isArray(data)) {
        markdown = arrayToMarkdownTable(data);
    } else if (Array.isArray(data.courses)) {
        markdown = arrayToMarkdownTable(data.courses);
    } else {
        // Try to find the first array property
        const arrProp = Object.keys(data).find(k => Array.isArray(data[k]));
        if (arrProp) {
            markdown = arrayToMarkdownTable(data[arrProp]);
        } else {
            markdown = 'No array data found.';
        }
    }
    return markdown;
}
*/
