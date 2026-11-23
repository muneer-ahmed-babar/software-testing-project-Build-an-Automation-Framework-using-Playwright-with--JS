import fs from 'fs';
import path from 'path';

const logFolder = path.resolve(process.cwd(), 'logs');
const logFile = path.join(logFolder, 'test-run.log');

// Prints to the console AND appends to logs/test-run.log (Jenkins archives this file)
function write(level, message) {
  fs.mkdirSync(logFolder, { recursive: true });
  const line = `[${new Date().toISOString()}] [${level}] ${message}`;
  console.log(line);
  fs.appendFileSync(logFile, line + '\n');
}

export const logger = {
  info: (message) => write('INFO', message),
  error: (message) => write('ERROR', message),
};
