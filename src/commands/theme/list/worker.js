import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { logInfo } from '../../../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 列出所有可用主题
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  console.log();
  console.log(chalk.cyan('Available Themes:'));
  console.log();
  
  const themes = [
    {
      name: 'default',
      description: 'Default clean theme with modern styling',
      builtin: true
    },
    {
      name: 'github',
      description: 'GitHub-style markdown rendering',
      builtin: true
    },
    {
      name: 'wechat',
      description: 'WeChat article style (optimized for mobile)',
      builtin: true
    },
    {
      name: 'zhihu',
      description: 'Zhihu article style',
      builtin: true
    }
  ];
  
  themes.forEach(theme => {
    const status = theme.builtin ? chalk.green('[Built-in]') : chalk.blue('[Custom]');
    console.log(`  ${chalk.yellow(theme.name.padEnd(12))} ${status} ${chalk.gray(theme.description)}`);
  });
  
  console.log();
  console.log(chalk.gray('Use "md-beautify theme use <name>" to set the default theme'));
  console.log(chalk.gray('Use "md-beautify theme preview <name>" to preview a theme'));
  console.log();
}