import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { glob } from 'glob';

/**
 * 动态加载所有命令定义
 * @param {string} pattern - glob模式
 * @returns {Promise<Array>} 命令定义数组
 */
const getAllCommands = async (pattern) => {
  const cmds = await glob(pattern);
  const allCmds = cmds.map(cmdFolder => {
    const cmdName = path.basename(cmdFolder);
    return import(pathToFileURL(path.resolve(cmdFolder, 'index.js')));
  });
  return Promise.all(allCmds);
};

export default getAllCommands;