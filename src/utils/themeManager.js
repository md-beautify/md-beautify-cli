import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 主题管理器
 */
export class ThemeManager {
  constructor() {
    this.themesDir = path.resolve(__dirname, '../themes');
    this.defaultThemePath = path.resolve(__dirname, '../md-beautify.css');
    this.customThemePath = path.resolve(__dirname, '../custom.css');
  }

  /**
   * 获取所有可用主题
   * @returns {Array} 主题列表
   */
  getAvailableThemes() {
    const themes = [
      {
        name: 'default',
        description: 'Default clean theme with modern styling',
        builtin: true,
        path: this.defaultThemePath
      }
    ];

    // 扫描themes目录中的主题文件
    if (fs.existsSync(this.themesDir)) {
      const themeFiles = fs.readdirSync(this.themesDir)
        .filter(file => file.endsWith('.css'))
        .map(file => file.replace('.css', ''));

      themeFiles.forEach(themeName => {
        const descriptions = {
          'github': 'GitHub-style markdown rendering',
          'wechat': 'WeChat article style (optimized for mobile)',
          'zhihu': 'Zhihu article style (professional tech articles)'
        };

        themes.push({
          name: themeName,
          description: descriptions[themeName] || `${themeName} theme`,
          builtin: true,
          path: path.join(this.themesDir, `${themeName}.css`)
        });
      });
    }

    return themes;
  }

  /**
   * 检查主题是否存在
   * @param {string} themeName 主题名称
   * @returns {boolean}
   */
  themeExists(themeName) {
    const themes = this.getAvailableThemes();
    return themes.some(theme => theme.name === themeName);
  }

  /**
   * 获取主题CSS内容
   * @param {string} themeName 主题名称
   * @returns {string} CSS内容
   */
  getThemeCSS(themeName) {
    const themes = this.getAvailableThemes();
    const theme = themes.find(t => t.name === themeName);
    
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`);
    }

    if (!fs.existsSync(theme.path)) {
      throw new Error(`Theme file not found: ${theme.path}`);
    }

    let css = fs.readFileSync(theme.path, 'utf8');

    // 如果存在自定义CSS，也加载它
    if (fs.existsSync(this.customThemePath)) {
      const customCSS = fs.readFileSync(this.customThemePath, 'utf8');
      css += '\n/* Custom styles */\n' + customCSS;
    }

    return css;
  }

  /**
   * 获取主题信息
   * @param {string} themeName 主题名称
   * @returns {Object} 主题信息
   */
  getThemeInfo(themeName) {
    const themes = this.getAvailableThemes();
    return themes.find(t => t.name === themeName);
  }

  /**
   * 获取所有主题名称
   * @returns {Array<string>} 主题名称列表
   */
  getThemeNames() {
    return this.getAvailableThemes().map(theme => theme.name);
  }
}

// 导出单例实例
export const themeManager = new ThemeManager();