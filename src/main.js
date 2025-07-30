import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';
import { createCommand, Command } from 'commander';
import { version } from './utils/constants.js';
import getAllCommands from './utils/getAllCommands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const cmdPath = path.resolve(__dirname, './commands');
  const cmdDefs = await getAllCommands(cmdPath + '/*/');
  const program = createCommand();

  await setupCmd(program, cmdDefs);

  program
    .name('md-beautify')
    .version(version)
    .usage('[command] [options]')
    .description('Convert Markdown files to beautiful HTML with inline styles')
    .parseAsync(process.argv);
}

/**
 * 设置命令
 * @param {Command} cmder 
 * @param {Array} cmdDefs 
 */
function setupCmd(cmder, cmdDefs) {
  const mapped = cmdDefs.map(async ({ default: cmdDef }) => {
    if (!cmdDef || !cmdDef.cmdName) {
      console.warn('Invalid command definition found, skipping...');
      return;
    }
    
    const newCmd = cmder.command(cmdDef.cmdName);
    
    // 配置选项
    if (cmdDef.options instanceof Array && cmdDef.options.length > 0) {
      cmdDef.options.forEach((opt) => {
        newCmd.option(...opt);
      });
    }

    newCmd
      .alias(cmdDef.alias)
      .description(cmdDef.description || cmdDef.cmdName)
      .action(async (...arrParams) => {
        const length = arrParams.length;
        const command = arrParams.slice(-1)[0];
        const options = arrParams.slice(-2)[0];

        if (!(command instanceof Command)) {
          console.log(`Please check the usage of ${chalk.yellow(cmdDef.name)}`);
          newCmd.help();
          return;
        }

        if (typeof cmdDef.run === 'function') {
          try {
            await cmdDef.run(command, options);
          } catch (error) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
          }
        }
      });
  });

  return Promise.all(mapped.filter(Boolean));
}

export default main;