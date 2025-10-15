import { saveDB, getDB, insert } from './db.js';
import { processOptions } from './utils.js';
import { spawn } from 'child_process';
import {
  formatSuccess,
  formatError,
  formatWarning,
  formatCreateSuccess,
  formatUpdateSuccess,
  formatRemoveSuccess,
  formatNoteListItem,
  formatSearchResult,
  formatNoteDetail,
  formatSearchHeader,
  formatListHeader,
  formatSeparator,
  formatInfo,
} from './styles.js';

export const create = async (args) => {
  if (args.length < 2) {
    console.log(
      formatError('Insufficient arguments. Usage: create <title> <content> [--tags tag1 tag2]')
    );
    return true;
  }

  const allowedTags = ['--tags', '-t'];
  const tags = processOptions(args, allowedTags);
  const note = {
    id: crypto.randomUUID(),
    title: args[0],
    content: args[1],
    tags,
    createdAt: Date.now(),
  };

  await insert(note);
  console.log(formatCreateSuccess(note.title, note.id));
  return true;
};

export const find = async (args) => {
  if (args.length < 1) {
    console.log(formatError('Insufficient arguments. Usage: find <keyword> [--tags tag1 tag2]'));
    return true;
  }

  const db = await getDB();
  const tags = processOptions(args, ['--tags', '-t']);
  const keyword = args[0] ? args[0].toLowerCase() : null;

  const notes = db.notes.filter((note) => {
    const matchesKeyword = keyword
      ? note.title.toLowerCase().includes(keyword) || note.content.toLowerCase().includes(keyword)
      : true;
    const matchesTags = tags.length > 0 ? tags.every((tag) => note.tags.includes(tag)) : true;
    return matchesKeyword && matchesTags;
  });

  if (notes.length === 0) {
    console.log(formatWarning('No notes found matching your criteria'));
    return true;
  }

  console.log(formatSearchHeader(keyword, tags, notes.length));
  console.log(formatSeparator());
  notes.forEach((note, index) => {
    console.log(formatSearchResult(note, keyword, index));
    if (index < notes.length - 1) {
      console.log(''); // Add spacing between results
    }
  });
  console.log(formatSeparator());

  return true;
};

export const view = async (id) => {
  const db = await getDB();

  if (!id || id.length < 1) {
    console.log(formatError('Insufficient arguments. Usage: view <id>'));
    return true;
  }

  const noteId = Array.isArray(id) ? id[0] : id;
  const note = db.notes.find((note) => note.id === noteId);

  if (!note) {
    console.log(formatError('Note not found'));
    return true;
  }

  console.log(formatNoteDetail(note));
  return true;
};

export const remove = async (ids, cli) => {
  const db = await getDB();

  if (!ids || ids.length < 1) {
    console.log(formatError('Insufficient arguments. Usage: remove <id> [<id2> <id3> ...]'));
    return true;
  }

  const uniqueIds = new Set(ids);
  const noteIndexs = [];
  uniqueIds.forEach((id) => {
    const index = db.notes.findIndex((note) => note.id === id);
    noteIndexs.push(index);
  });

  noteIndexs.sort((a, b) => b - a);

  if (noteIndexs.includes(-1)) {
    console.log(formatError('One or more notes not found'));
    return true;
  }

  let confirm = await cli.input(
    `Are you sure you want to remove ${noteIndexs.length} note${noteIndexs.length !== 1 ? 's' : ''}? (y/n): `
  );
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log(formatWarning('Operation cancelled'));
    return true;
  }

  noteIndexs.forEach((index) => {
    const note = db.notes[index];
    db.notes.splice(index, 1);
    console.log(formatRemoveSuccess(note.title, note.id));
  });

  await saveDB(db);
  return true;
};

export const list = async () => {
  const db = await getDB();

  if (db.notes.length === 0) {
    console.log(
      formatWarning('No notes found. Create your first note with: create <title> <content>')
    );
    return true;
  }

  console.log(formatListHeader(db.notes.length));
  console.log(formatSeparator());
  db.notes.forEach((note, index) => {
    console.log(formatNoteListItem(note, index));
  });
  console.log(formatSeparator());

  return true;
};

export const update = async (args, cli) => {
  if (args.length < 1) {
    console.log(
      formatError(
        'Insufficient arguments. Usage: update <id> [<title> <content>] [--tags tag1 tag2] or update <id> (to open editor)'
      )
    );
    return true;
  }

  const db = await getDB();
  const id = args[0];
  const noteIndex = db.notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    console.log(formatError('Note not found'));
    return true;
  }

  const note = db.notes[noteIndex];
  let title = note.title;
  let content = note.content;
  let tags = note.tags;

  if (args.length === 1) {
    console.log('if you want to not change a field, leave it empty and press enter');
    console.log(
      'To edit tags, provide a comma-separated list (e.g., tag1, tag2). Leave empty to keep existing tags.'
    );
    try {
      title = (await cli.input('Title: ')) || note.title;
      content = (await cli.input('Content: ')) || note.content;
      const tagsInput = await cli.input('Tags (comma-separated): ');
      if (tagsInput.trim() !== '') {
        tags = tagsInput.split(',').map((tag) => tag.trim());
      }
    } catch (error) {
      console.log(formatError('Invalid JSON format from editor'));
      return true;
    }
  } else {
    const allowedTags = ['--tags', '-t'];
    const allowedContent = ['--content', '-c'];

    title = args[1] || note.title;

    const processedContent = processOptions(args, allowedContent);
    content = processedContent.length > 0 ? processedContent.join(' ') : args[2] || note.content;

    const processedTags = processOptions(args, allowedTags);
    tags = processedTags.length > 0 ? processedTags : note.tags;
  }

  db.notes[noteIndex] = {
    ...note,
    title,
    content,
    tags,
  };
  await saveDB(db);
  console.log(formatUpdateSuccess(db.notes[noteIndex].title, db.notes[noteIndex].id));
  return true;
};

export const clean = async (cli) => {
  const db = await getDB();
  const count = db.notes.length;
  let confirm = await cli.input('Are you sure you want to remove all notes? (y/n): ');
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log(formatWarning('Operation cancelled'));
    return true;
  }
  if (count === 0) {
    console.log(formatWarning('No notes to remove'));
    return true;
  }
  await saveDB({ notes: [] });
  console.log(formatWarning(`All notes removed (${count} note${count !== 1 ? 's' : ''} deleted)`));
  return true;
};

export const web = async (args = []) => {
  const port = args[0] || 5000;

  const portNum = parseInt(port, 10);

  if (isNaN(portNum)) {
    console.log(formatError('Invalid port. Please use a port between 1024 and 65535'));
    return true;
  }

  try {
    const db = await getDB();
    console.log(formatInfo(`Starting web server on port ${portNum}...`));
    console.log(formatInfo(`Notes available: ${db.notes.length}`));
    console.log(formatInfo(`Open http://localhost:${portNum} in your browser`));
    console.log(formatInfo('Press Ctrl+C to stop the server\n'));

    const controller = new AbortController();
    const { signal } = controller;

    const child = spawn('node', ['./src/server.js', portNum.toString()], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      signal,
      env: {
        ...process.env,
        PORT: portNum.toString(),
      },
    });

    child.on('error', (err) => {
      controller.abort();
    });

    child.on('exit', (code, signal) => {
      if (code !== 0 && code !== null) {
        console.log(formatError(`Server exited with code ${code}`));
      } else if (signal) {
        console.log(formatInfo(`Server stopped by signal ${signal}`));
      } else {
        console.log(formatSuccess('Server stopped'));
      }
    });

    process.on('SIGINT', () => {
      console.log('\n' + formatInfo('Stopping server...'));
      controller.abort();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      controller.abort();
      process.exit(0);
    });

    await new Promise((resolve) => {
      child.on('close', resolve);
    });

    return false;
  } catch (error) {
    console.log(formatError(`Error starting web server: ${error.message}`));
    return true;
  }
};
