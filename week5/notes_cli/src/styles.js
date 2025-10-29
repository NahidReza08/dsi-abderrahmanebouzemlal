import chalk from 'chalk';

export const theme = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,
  highlight: chalk.bold.white,
  dim: chalk.gray,
  tag: chalk.magenta,
  id: chalk.dim,
  accent: chalk.blue,
};

const icons = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  note: '📝',
  search: '🔍',
  delete: '🗑️',
  update: '✏️',
  list: '📋',
  tag: '🏷️',
  calendar: '📅',
  document: '📄',
};

export function formatSuccess(message) {
  return theme.success(`${icons.success} ${message}`);
}

export function formatError(message) {
  return theme.error(`${icons.error} ${message}`);
}

export function formatWarning(message) {
  return theme.warning(`${icons.warning} ${message}`);
}

export function formatInfo(message) {
  return theme.info(`${icons.info} ${message}`);
}

export function formatNoteTitle(title, id) {
  return `${theme.highlight(title)} ${theme.id(`(${id})`)}`;
}

export function formatTags(tags) {
  if (!tags || tags.length === 0) return theme.dim('No tags');
  return tags.map((tag) => theme.tag(`[${tag}]`)).join(' ');
}

export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function highlightKeyword(text, keyword) {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, (match) => chalk.bgYellow.black(match));
}

export function formatNoteListItem(note, index) {
  const num = theme.dim(`${index + 1}.`);
  const title = theme.highlight(note.title);
  const id = theme.id(`(${note.id})`);
  const tagCount =
    note.tags.length > 0 ? theme.tag(`[${note.tags.length} tags]`) : theme.dim('[no tags]');

  return `${num} ${title} ${id} ${tagCount}`;
}

export function formatSearchResult(note, keyword, index) {
  const num = theme.dim(`${index + 1}.`);
  const title = highlightKeyword(theme.highlight(note.title), keyword);
  const id = theme.id(`(${note.id})`);
  const tags = formatTags(note.tags);
  const preview = highlightKeyword(truncate(note.content, 80), keyword);

  return [`${num} ${title} ${id}`, `   ${theme.dim(preview)}`, `   ${tags}`].join('\n');
}

export function formatNoteDetail(note) {
  const separator = theme.dim('─'.repeat(50));
  const date = new Date(note.createdAt).toLocaleString();

  return [
    separator,
    `${theme.accent('Title:')} ${theme.highlight(note.title)}`,
    `${theme.accent('ID:')} ${theme.id(note.id)}`,
    '',
    `${theme.accent('Content:')}`,
    note.content,
    '',
    `${theme.accent('Tags:')} ${formatTags(note.tags)}`,
    `${theme.accent('Created:')} ${theme.dim(date)}`,
    separator,
  ].join('\n');
}

export function formatHeader(text, icon = '') {
  const headerText = icon ? `${icon} ${text}` : text;
  return theme.info.bold(headerText);
}

export function formatSeparator(char = '─', length = 50) {
  return theme.dim(char.repeat(length));
}

export function formatCreateSuccess(title, id) {
  return formatSuccess(`Note created: ${theme.highlight(title)} ${theme.id(`(${id})`)}`);
}

export function formatUpdateSuccess(title, id) {
  return formatSuccess(`Note updated: ${theme.highlight(title)} ${theme.id(`(${id})`)}`);
}

export function formatRemoveSuccess(title, id) {
  return formatWarning(`Note removed: ${theme.highlight(title)} ${theme.id(`(${id})`)}`);
}

export function formatSearchHeader(keyword, tags, count) {
  const parts = [];

  if (keyword) {
    parts.push(`keyword: ${theme.highlight(keyword)}`);
  }
  if (tags.length > 0) {
    parts.push(`tags: ${formatTags(tags)}`);
  }

  const searchInfo = parts.length > 0 ? ` (${parts.join(', ')})` : '';
  return formatHeader(`${icons.search} Found ${theme.highlight(count)} note(s)${searchInfo}`);
}

export function formatListHeader(count) {
  return formatHeader(`${icons.list} Your Notes (${theme.highlight(count)} total)`);
}
