import chalk from 'chalk';
import { setConfigValue } from '../../config/configManager.js';
import { logSuccess, logError } from '../../../utils/helpers.js';
import { themeManager } from '../../../utils/themeManager.js';

/**
 * 设置默认主题
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  const themeName = command.args[0];
  
  if (!themeName) {
    logError('Please specify a theme name');
    console.log('Usage: md-beautify theme use <theme-name>');
    console.log('Use "md-beautify theme list" to see available themes');
    return;
  }
  
  if (!themeManager.themeExists(themeName)) {
    logError(`Theme "${themeName}" not found`);
    const availableThemes = themeManager.getThemeNames();
    console.log('Available themes:', availableThemes.join(', '));
    return;
  }
  
  const success = setConfigValue('theme', themeName);
  
  if (success) {
    logSuccess(`Default theme set to: ${chalk.yellow(themeName)}`);
  }
}