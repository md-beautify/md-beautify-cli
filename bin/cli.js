#!/usr/bin/env node

import figlet from 'figlet';
import chalk from 'chalk';
import { version } from '../src/utils/constants.js';
import main from '../src/main.js';

const banner = `
  MD Beautify
`;

console.log(chalk.cyan(figlet.textSync('MD Beautify', { horizontalLayout: 'full' })));
console.log(chalk.gray(`v${version} - Markdown to Beautiful HTML Converter`));
console.log();

main();