import fs from 'fs';
import path from 'path';

// Reads a file from the testdata folder and turns it into a JS object.
// Example: readJson('loginData.json')
export function readJson(fileName) {
  const filePath = path.resolve(process.cwd(), 'testdata', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
