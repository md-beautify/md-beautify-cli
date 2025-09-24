/**
 * 主题管理命令定义
 * examples: [
 *   'md-beautify theme list',
 *   'md-beautify theme use github',
 *   'md-beautify theme create my-theme',
 *   'md-beautify theme preview github',
 * ]
 */
import { run as listThemes } from './list/worker.js';
import { run as useTheme } from './use/worker.js';
import { run as previewTheme } from './preview/worker.js';
import { run as currentTheme } from './current/worker.js';

export default {
  name: 'theme',
  cmdName: 'theme',
  alias: 't',
  description: 'Manage themes',
  options: [
    ['-o, --output <file>', 'Output file for preview (default: theme-preview.html)']
  ],
  run: async (command, options) => {
    const args = command.args;
    const subCommand = args[0];
    
    // 创建一个模拟的command对象
    const mockCommand = {
      args: args.slice(1),
      help: () => console.log('Help for theme command')
    };
    
    switch (subCommand) {
      case 'list':
      case 'ls':
        await listThemes(mockCommand, options);
        break;
      case 'use':
        if (args.length < 2) {
          console.log('Usage: md-beautify theme use <theme-name>');
          process.exit(1);
        }
        mockCommand.args = [args[1]];
        await useTheme(mockCommand, options);
        break;
      case 'preview':
        if (args.length < 2) {
          console.log('Usage: md-beautify theme preview <theme-name> [-o output.html]');
          process.exit(1);
        }
        mockCommand.args = [args[1]];
        await previewTheme(mockCommand, options);
        break;
      case 'current':
        await currentTheme(mockCommand, options);
        break;
      default:
        console.log('Available theme commands:');
        console.log('  list (ls)    - List available themes');
        console.log('  use          - Set default theme');
        console.log('  preview      - Preview a theme with sample content');
        console.log('  current      - Show the currently active theme');
        console.log('');
        console.log('Use "md-beautify theme <command> --help" for more information.');
    }
  }
};