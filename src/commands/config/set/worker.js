import { setConfigValue } from '../configManager.js';
import { logSuccess, logError } from '../../../utils/helpers.js';

/**
 * 设置配置值
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  const [key, value] = command.args;
  
  if (!key || value === undefined) {
    logError('Please specify both key and value');
    command.help();
    return;
  }
  
  const success = setConfigValue(key, value);
  
  if (success) {
    logSuccess(`Configuration updated: ${key} = ${value}`);
  }
}