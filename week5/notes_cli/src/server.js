import fs from 'node:fs/promises';
import http from 'node:http';
import open from 'open';
import { getDB } from './db.js';
import { argv } from 'node:process';

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
};

const formatNotes = (notes) => {
  if (notes.length === 0) {
    return '<p>No notes available.</p>';
  }
  return notes
    .map((note) => {
      return `
    <div class="note">
      <p>${note.content}</p>
      <div class="tags" style="">
        ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
    `;
    })
    .join('\n');
};

const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL('./template.html', import.meta.url).pathname;
    const template = await fs.readFile(HTML_PATH, 'utf-8');
    const html = interpolate(template, { notes: formatNotes(notes) });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
};

export const start = (notes, port = 5000) => {
  const server = createServer(notes);
  server.listen(port, (error) => {
    console.log(`Server is listening on http://localhost:${port}/`);
  });
  open(`http://localhost:${port}`);
};
async function main() {
  const notes = await getDB();
  start(notes.notes, argv[2] || 5000);
}
main();