import inquirer from 'inquirer';
import { resetConfig } from '../configManager.js';
import { logSuccess, logInfo } from '../../../utils/helpers.js';

/**
 * 重置配置
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  if (!options.force) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to reset all configuration to defaults?',
        default: false
      }
    ]);
    
    if (!answers.confirm) {
      logInfo('Configuration reset cancelled');
      return;
    }
  }
  
  const success = resetConfig();
  
  if (success) {
    logSuccess('Configuration reset to defaults');
  }
}