import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

/**
 * 检查文件是否存在
 * @param {string} filePath 
 * @returns {boolean}
 */
export function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * 检查目录是否存在
 * @param {string} dirPath 
 * @returns {boolean}
 */
export function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * 确保目录存在，不存在则创建
 * @param {string} dirPath 
 */
export function ensureDir(dirPath) {
  if (!dirExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 获取文件扩展名
 * @param {string} filePath 
 * @returns {string}
 */
export function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

/**
 * 生成带时间戳的文件名
 * @param {string} baseName 
 * @param {string} extension 
 * @returns {string}
 */
export function generateTimestampFilename(baseName, extension = '.html') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${baseName}_${timestamp}${extension}`;
}

/**
 * 格式化文件大小
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 创建加载动画
 * @param {string} text 
 * @returns {ora.Ora}
 */
export function createSpinner(text) {
  return ora({
    text,
    spinner: 'dots',
    color: 'cyan'
  });
}

/**
 * 打印成功消息
 * @param {string} message 
 */
export function logSuccess(message) {
  console.log(chalk.green('✓'), message);
}

/**
 * 打印错误消息
 * @param {string} message 
 */
export function logError(message) {
  console.log(chalk.red('✗'), message);
}

/**
 * 打印警告消息
 * @param {string} message 
 */
export function logWarning(message) {
  console.log(chalk.yellow('⚠'), message);
}

/**
 * 打印信息消息
 * @param {string} message 
 */
export function logInfo(message) {
  console.log(chalk.blue('ℹ'), message);
}