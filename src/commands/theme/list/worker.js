import chalk from 'chalk';
import { themeManager } from '../../../utils/themeManager.js';

/**
 * 列出所有可用主题
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  console.log();
  console.log(chalk.cyan('Available Themes:'));
  console.log();
  
  const themes = themeManager.getAvailableThemes();
  
  themes.forEach(theme => {
    const status = theme.builtin ? chalk.green('[Built-in]') : chalk.blue('[Custom]');
    console.log(`  ${chalk.yellow(theme.name.padEnd(12))} ${status} ${chalk.gray(theme.description)}`);
  });
  
  console.log();
  console.log(chalk.gray('Use "md-beautify theme use <theme-name>" to set the default theme'));
  console.log(chalk.gray('Use "md-beautify theme preview <theme-name>" to preview a theme'));
  console.log();
}