import { spawnSync } from 'child_process';
import fs from 'fs';
import minimist from 'minimist';

export const parseArgs = (args) => {
  const finalArg = [];
  let currentArg = '';
  let insideQuotes = false;
  let quoteChar = null;

  for (let i = 0; i < args.length; i++) {
    const char = args[i];

    if ((char === '"' || char === "'") && !insideQuotes) {
      insideQuotes = true;
      quoteChar = char;
      continue;
    } else if (char === quoteChar && insideQuotes) {
      insideQuotes = false;
      quoteChar = null;
      continue;
    }

    if (char === ' ' && !insideQuotes) {
      if (currentArg !== '') {
        finalArg.push(currentArg.trim());
        currentArg = '';
      }
    }
    currentArg += char;
  }

  if (currentArg !== '') {
    finalArg.push(currentArg.trim());
  }

  return finalArg;
};

export const processOptions = (args, allowedOptions) => {
  let tags = [];

  for (let i = 0; i < args.length; i++) {
    if (allowedOptions.includes(args[i]) && i + 1 < args.length) {
      if (args[i + 1].startsWith('--') || args[i + 1].startsWith('-')) {
        console.log('Tags value is missing');
        return true;
      }
      if (args[i + 1].trim() === '') {
        console.log('Tags value is missing');
        return true;
      }
      tags = args[i + 1].split(',').map((tag) => tag.trim());
      args.splice(i, 2);
      break;
    }
  }
  return tags;
};

export const openEditor = async (fileType, initialText = '') => {
  if (!['json', 'txt'].includes(fileType)) {
    throw new Error('Unsupported file type. Only "json" and "txt" are supported.');
  }
  const tempFile = new URL(`./temp-edit-${Date.now()}.${fileType}`, import.meta.url).pathname;

  fs.writeFileSync(tempFile, initialText);

  const result = spawnSync('vim', [tempFile], { stdio: 'inherit' });

  let finalContent = '';
  if (fs.existsSync(tempFile)) {
    finalContent = fs.readFileSync(tempFile, 'utf8');
    fs.unlinkSync(tempFile);
  }

  return finalContent;
};
