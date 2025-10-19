#!/usr/bin/env node
import minimist from 'minimist';
import readline from 'readline';
import { create, list, update, remove, find, clean, view, web } from './src/notesCommands.js';
import { parseArgs } from './src/utils.js';
import { formatError, theme } from './src/styles.js';
import chalk from 'chalk';

const argv = minimist(process.argv.slice(2));

class CLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.commands = {
      help: this.showHelp.bind(this),
      clear: this.clearScreen.bind(this),
      exit: this.exit.bind(this),
      create: create.bind(this),
      list: list.bind(this),
      update: this.update.bind(this),
      remove: remove.bind(this),
      find: find.bind(this),
      clean: this.clean.bind(this),
      view: view.bind(this),
      remove: this.remove.bind(this),
      web: web.bind(this),
    };
  }

  async start() {
    console.log(chalk.cyan.bold('\n Note Taking App\n'));
    console.log(theme.dim("Type 'help' for available commands\n"));

    while (true) {
      try {
        const input = await this.input(theme.accent('# '));
        const args = parseArgs(input);

        if (args.length === 0) continue;

        const command = args.shift();

        if (this.commands[command]) {
          const shouldContinue = await this.commands[command](args);
          if (!shouldContinue) break;
        } else {
          console.log(
            formatError(`Unknown command: '${command}'. Type 'help' for available commands.`)
          );
        }
      } catch (error) {
        console.log(formatError(`Error executing command: ${error.message}`));
      }
    }

    this.rl.close();
  }

  input(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  showHelp() {
    const separator = theme.dim('─'.repeat(60));

    console.log('\n' + chalk.cyan.bold(' Available Commands'));
    console.log(separator);

    console.log(chalk.yellow.bold('\n🔧 System Commands:'));
    console.log(
      `  ${theme.highlight('help')}              ${theme.dim('- Show this help message')}`
    );
    console.log(`  ${theme.highlight('clear')}             ${theme.dim('- Clear the screen')}`);
    console.log(`  ${theme.highlight('exit')}              ${theme.dim('- Exit the CLI')}`);

    console.log(chalk.yellow.bold('\n Note Commands:'));
    console.log(
      `  ${theme.highlight('create')} ${theme.accent('<title> <content> [--tags tag1,tag2]')}`
    );
    console.log(`    ${theme.dim('Create a new note')}`);
    console.log(`  ${theme.highlight('list')}`);
    console.log(`    ${theme.dim('List all notes')}`);
    console.log(`  ${theme.highlight('find')} ${theme.accent('<keyword> [--tags tag1,tag2]')}`);
    console.log(`    ${theme.dim('Find notes by keyword or tags')}`);
    console.log(`  ${theme.highlight('view')} ${theme.accent('<id>')}`);
    console.log(`    ${theme.dim('View a specific note')}`);
    console.log(
      `  ${theme.highlight('update')} ${theme.accent('<id> <title> <content> [--tags]')}`
    );
    console.log(`    ${theme.dim('Update a note')}`);
    console.log(`  ${theme.highlight('remove')} ${theme.accent('<id>')}`);
    console.log(`    ${theme.dim('Remove a note')}`);
    console.log(`  ${theme.highlight('clean')}`);
    console.log(`    ${theme.dim('Remove all notes')}`);
    console.log(`  ${theme.highlight('web')} ${theme.accent('[port]')}`);
    console.log(`    ${theme.dim('Start web server to view notes in browser')}`);

    console.log(chalk.yellow.bold('\n💡 Examples:'));
    console.log(
      `  ${theme.dim('$')} ${theme.accent('create "My Note" "Note content" --tags work urgent')}`
    );
    console.log(`  ${theme.dim('$')} ${theme.accent('find "meeting" -t work')}`);
    console.log(
      `  ${theme.dim('$')} ${theme.accent('update abc-123 "Updated Title" "New content"')}`
    );
    console.log('');

    console.log(separator + '\n');
    return true;
  }

  clean() {
    return clean(this);
  }

  remove(args) {
    return remove(args, this);
  }

  update(args) {
    return update(args, this);
  }

  clearScreen() {
    console.clear();
    return true;
  }

  exit() {
    console.log(chalk.cyan('\nGoodbye!\n'));
    return false;
  }
}

async function main() {
  if (argv._.length === 0) {
    // Interactive mode
    const cli = new CLI();
    await cli.start();
  } else {
    // Command-line mode
    const args = argv['_'];
    const command = args.shift();
    const cli = new CLI();

    if (cli.commands[command]) {
      try {
        await cli.commands[command](args);
        process.exit(0);
      } catch (error) {
        console.log(formatError(`Error: ${error.message}`));
        process.exit(1);
      }
    } else {
      console.log(
        formatError(`Unknown command: '${command}'. Type 'help' for available commands.`)
      );
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.log(formatError(`Fatal error: ${error.message}`));
  process.exit(1);
});
