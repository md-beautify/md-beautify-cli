/**
 * 配置管理命令定义
 * examples: [
 *   'md-beautify config list',
 *   'md-beautify config set theme github',
 *   'md-beautify config get theme',
 *   'md-beautify config reset',
 * ]
 */
import { run as listConfig } from './list/worker.js';
import { run as setConfig } from './set/worker.js';
import { run as getConfig } from './get/worker.js';
import { run as resetConfig } from './reset/worker.js';

export default {
  cmdName: 'config',
  alias: 'cfg',
  description: 'Manage configuration settings',
  options: [
    ['--force', 'Force reset without confirmation']
  ],
  run: async (command, options) => {
    const args = command.args;
    const subCommand = args[0];
    
    // 创建一个模拟的command对象
    const mockCommand = {
      args: args.slice(1),
      help: () => console.log('Help for config command')
    };
    
    switch (subCommand) {
      case 'list':
      case 'ls':
        await listConfig(mockCommand, options);
        break;
      case 'set':
        if (args.length < 3) {
          console.log('Usage: md-beautify config set <key> <value>');
          process.exit(1);
        }
        mockCommand.args = [args[1], args[2]];
        await setConfig(mockCommand, options);
        break;
      case 'get':
        if (args.length < 2) {
          console.log('Usage: md-beautify config get <key>');
          process.exit(1);
        }
        mockCommand.args = [args[1]];
        await getConfig(mockCommand, options);
        break;
      case 'reset':
        await resetConfig(mockCommand, options);
        break;
      default:
        console.log('Available config commands:');
        console.log('  list (ls)    - List all configuration settings');
        console.log('  set          - Set a configuration value');
        console.log('  get          - Get a configuration value');
        console.log('  reset        - Reset configuration to defaults');
        console.log('');
        console.log('Use "md-beautify config <command> --help" for more information.');
    }
  }
};