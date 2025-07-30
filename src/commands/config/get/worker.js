import chalk from 'chalk';
import { getConfigValue } from '../configManager.js';
import { logError } from '../../../utils/helpers.js';

/**
 * 获取配置值
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  const key = command.args[0];
  
  if (!key) {
    logError('Please specify a configuration key');
    command.help();
    return;
  }
  
  const value = getConfigValue(key);
  
  if (value === undefined) {
    logError(`Configuration key not found: ${key}`);
    return;
  }
  
  const displayValue = value === null ? chalk.gray('null') : 
                      typeof value === 'boolean' ? (value ? chalk.green('true') : chalk.red('false')) :
                      chalk.yellow(value);
  
  console.log(`${chalk.blue(key)}: ${displayValue}`);
}