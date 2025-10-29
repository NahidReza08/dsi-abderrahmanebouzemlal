# 📝 Notes CLI

A beautiful, feature-rich command-line note-taking application built with Node.js. Manage your notes efficiently with tags, search functionality, and a colorful interface.

## Features

- 🎨 **Beautiful CLI Interface** - Colorful output with intuitive formatting
- 🔍 **Powerful Search** - Find notes by keywords or tags with highlighted results
- 🏷️ **Tag System** - Organize notes with multiple tags
- 📝 **Editor Support** - Edit notes in your favorite text editor
- 💾 **Local Storage** - All notes stored locally in JSON format
- 🚀 **Two Modes** - Interactive shell or direct command execution
- ⚡ **Fast & Lightweight** - No external dependencies except Chalk

## 📦 Installation

### Prerequisites

- Node.js (v24.0.0 or higher)
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/AbderrahmaneBouzemlal/notes-cli.git
cd notes-cli
```

2. Install dependencies:

```bash
npm install
```

3. Make the CLI executable (Unix/Linux/Mac):

```bash
chmod +x index.js
```

4. (Optional) Link globally to use from anywhere:

```bash
npm link
```

## 🚀 Usage

### Interactive Mode

Start the interactive shell:

```bash
node index.js
```

Or if globally linked:

```bash
notes
```

### Command-Line Mode

Execute commands directly:

```bash
node index.js <command> [arguments]
```

## 📚 Commands

### System Commands

| Command | Description                 |
| ------- | --------------------------- |
| `help`  | Show all available commands |
| `clear` | Clear the terminal screen   |
| `exit`  | Exit the application        |

### Note Commands

#### Create a Note

```bash
create <title> <content> [--tags tag1 tag2 ...]
```

**Example:**

```bash
create "Meeting Notes" "Discuss project timeline" --tags work urgent
create "Shopping List" "Milk, Eggs, Bread" -t personal
```

#### List All Notes

```bash
list
```

Shows all notes with titles, IDs, and tag count.

#### Find Notes

```bash
find <keyword> [--tags tag1 tag2 ...]
```

**Examples:**

```bash
find "meeting"
find "project" --tags work
find "" -t personal urgent
```

Search results highlight matching keywords.

#### View Note Details

```bash
view <note-id>
```

Displays full note with title, content, tags, and creation date.

#### Update a Note

```bash
# Using command line
update <note-id> <new-title> <new-content> [--tags tag1 tag2]

# Using editor (opens your default editor)
update <note-id>
```

**Examples:**

```bash
update abc-123 "Updated Title" "New content here"
update abc-123 "New Title" --content "New content" --tags work done
update abc-123  # Opens in editor
```

#### Remove a Note

```bash
remove <note-id>
```

Deletes a specific note (with confirmation in interactive mode).

#### Clean All Notes

```bash
clean
```

⚠️ Removes all notes (with confirmation in interactive mode).

## 🎨 Color Scheme

The CLI uses a consistent color scheme for better readability:

- 🟢 **Green** - Success messages
- 🔴 **Red** - Error messages
- 🟡 **Yellow** - Warnings and destructive actions
- 🔵 **Cyan** - Information and headers
- 🟣 **Magenta** - Tags
- ⚪ **White/Bold** - Highlighted text
- ⚫ **Gray** - Dimmed text (IDs, timestamps)

## 📁 Project Structure

```
notes-cli/
├── index.js                 # Main CLI entry point
├── src/
│   ├── notesCommands.js    # Command implementations
│   ├── styles.js           # Styling and formatting
│   ├── db.js               # Database operations
│   └── utils.js            # Utility functions
├── package.json
└── README.md
```

## 🔧 Configuration

### Database Location

Notes are stored in a JSON file. The default location is determined by your `db.js` implementation.

## 💡 Tips & Tricks

1. **Use quotes** for multi-word titles and content:

   ```bash
   create "My Title" "My content with spaces"
   ```

2. **Search without keyword** to filter by tags only:

   ```bash
   find "" --tags work
   ```

3. **Partial ID matching** (if implemented):

   ```bash
   view abc  # Instead of full UUID
   ```

4. **Chain commands** in command-line mode:

   ```bash
   node index.js create "Note 1" "Content" && node index.js list
   ```

5. **Use the interactive mode** for frequent note-taking sessions - it's faster!

## 🙏 Acknowledgments

- Built with [Node.js](https://nodejs.org/)
- Styled with [Chalk](https://github.com/chalk/chalk)
- Inspired by the need for a simple, beautiful note-taking tool

**Happy Note-Taking! 📝✨**
