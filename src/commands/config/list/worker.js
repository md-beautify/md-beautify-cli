import chalk from 'chalk';
import { readConfig, getConfigPath } from '../configManager.js';
import { logInfo } from '../../../utils/helpers.js';

/**
 * 列出所有配置
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  const config = readConfig();
  const configPath = getConfigPath();
  
  console.log();
  console.log(chalk.cyan('Current Configuration:'));
  console.log(chalk.gray(`Config file: ${configPath}`));
  console.log();
  
  Object.entries(config).forEach(([key, value]) => {
    const displayValue = value === null ? chalk.gray('null') : 
                        typeof value === 'boolean' ? (value ? chalk.green('true') : chalk.red('false')) :
                        chalk.yellow(value);
    
    console.log(`  ${chalk.blue(key.padEnd(15))} ${displayValue}`);
  });
  
  console.log();
}