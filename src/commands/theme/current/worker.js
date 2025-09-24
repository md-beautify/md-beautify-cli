import chalk from 'chalk';
import { getConfigValue } from '../../config/configManager.js';
import { themeManager } from '../../../utils/themeManager.js';
import { logInfo } from '../../../utils/helpers.js';

/**
 * 显示当前使用的主题
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  // 获取当前主题配置
  const currentTheme = getConfigValue('theme') || 'default';
  
  // 获取主题信息
  const themeInfo = themeManager.getThemeInfo(currentTheme);
  
  console.log();
  console.log(chalk.cyan('Current Theme:'));
  console.log();
  
  // 显示主题名称和状态
  console.log(`  ${chalk.bold('Theme Name:')} ${chalk.yellow(currentTheme)}`);
  
  // 如果有主题描述，则显示
  if (themeInfo && themeInfo.description) {
    console.log(`  ${chalk.bold('Description:')} ${chalk.gray(themeInfo.description)}`);
  }
  
  // 显示主题类型（内置/自定义）
  const themeType = themeInfo && themeInfo.builtin ? 'Built-in' : 'Custom';
  console.log(`  ${chalk.bold('Type:')} ${themeType}`);
  
  console.log();
  console.log(chalk.gray('Use "md-beautify theme list" to see all available themes'));
  console.log(chalk.gray('Use "md-beautify theme use <theme-name>" to change the default theme'));
  console.log();
}