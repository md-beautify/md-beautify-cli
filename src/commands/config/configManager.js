import fs from 'fs';
import path from 'path';
import os from 'os';
import { logSuccess, logError, logInfo } from '../../utils/helpers.js';

const CONFIG_DIR = path.join(os.homedir(), '.md-beautify');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  theme: 'default',
  outputDir: null,
  inline: false,
  timestamp: true,
  autoOpen: false,
  watchMode: false,
  customCss: null,
  copyToClipboard: false
};

/**
 * 确保配置目录存在
 */
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * 读取配置
 * @returns {Object}
 */
export function readConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { ...DEFAULT_CONFIG };
    }
    
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = JSON.parse(configContent);
    
    // 合并默认配置，确保所有字段都存在
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    logError(`Failed to read config: ${error.message}`);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * 写入配置
 * @param {Object} config 
 */
export function writeConfig(config) {
  try {
    ensureConfigDir();
    const configContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(CONFIG_FILE, configContent, 'utf8');
    return true;
  } catch (error) {
    logError(`Failed to write config: ${error.message}`);
    return false;
  }
}

/**
 * 获取配置值
 * @param {string} key 
 * @returns {any}
 */
export function getConfigValue(key) {
  const config = readConfig();
  return config[key];
}

/**
 * 设置配置值
 * @param {string} key 
 * @param {any} value 
 * @returns {boolean}
 */
export function setConfigValue(key, value) {
  const config = readConfig();
  
  // 验证配置键
  if (!(key in DEFAULT_CONFIG)) {
    logError(`Unknown configuration key: ${key}`);
    logInfo(`Available keys: ${Object.keys(DEFAULT_CONFIG).join(', ')}`);
    return false;
  }
  
  // 类型转换
  const defaultValue = DEFAULT_CONFIG[key];
  if (typeof defaultValue === 'boolean') {
    value = value === 'true' || value === true;
  } else if (typeof defaultValue === 'number') {
    value = Number(value);
    if (isNaN(value)) {
      logError(`Invalid number value for ${key}: ${value}`);
      return false;
    }
  }
  
  config[key] = value;
  return writeConfig(config);
}

/**
 * 重置配置
 * @returns {boolean}
 */
export function resetConfig() {
  return writeConfig({ ...DEFAULT_CONFIG });
}

/**
 * 获取配置文件路径
 * @returns {string}
 */
export function getConfigPath() {
  return CONFIG_FILE;
}