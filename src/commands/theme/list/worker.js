import chalk from 'chalk';
import { themeManager } from '../../../utils/themeManager.js';
import { getConfigValue } from '../../config/configManager.js';

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
  const currentTheme = getConfigValue('theme') || 'default';
  
  themes.forEach(theme => {
    const isCurrent = theme.name === currentTheme;
    const status = isCurrent ? chalk.magenta('[Current]') : 
                  theme.builtin ? chalk.green('[Built-in]') : chalk.blue('[Custom]');
    const themeName = isCurrent ? chalk.bold(chalk.cyan(theme.name)) : chalk.yellow(theme.name);
    console.log(`  ${themeName.padEnd(12)} ${status} ${chalk.gray(theme.description)}`);
  });
  
  console.log();
  console.log(chalk.gray('Use "md-beautify theme use <theme-name>" to set the default theme'));
  console.log(chalk.gray('Use "md-beautify theme preview <theme-name>" to preview a theme'));
  console.log();
}