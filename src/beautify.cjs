const fs = require('fs');
const path = require('path');
const juice = require('juice');
const glob = require('glob');
const { dateFormat } = require('./utils/funcs');

/**
 * 将CSS样式内联到HTML中
 * @param {string} htmlFilePath - HTML文件路径
 * @param {string[]} cssFilePaths - CSS文件路径数组
 * @returns {Promise<string>} - 返回内联样式后的HTML内容
 */
async function inlineStyles(htmlFilePath, cssFilePaths) {
  try {
    // 读取HTML文件
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // 读取所有CSS文件内容并合并
    const cssContents = cssFilePaths.map(cssPath => {
      try {
        return fs.readFileSync(cssPath, 'utf8');
      } catch (err) {
        console.error(`无法读取CSS文件: ${cssPath}`, err);
        return '';
      }
    }).join('\n');
    
    // 使用juice将CSS内联到HTML中
    const options = {
      applyStyleTags: true,
      removeStyleTags: false, // 不移除样式标签，保留伪元素样式
      preserveMediaQueries: true,
      preserveFontFaces: true,
      preserveKeyFrames: true,
      preservePseudos: true, // 保留伪元素样式
      insertPreservedExtraCss: true,
      extraCss: cssContents
    };
    
    const styledHtml = juice.inlineContent(htmlContent, cssContents, options);
    return styledHtml;
  } catch (err) {
    console.error('内联样式过程中发生错误:', err);
    throw err;
  }
}

/**
 * 主函数 - 查找最新的HTML文件并内联样式
 */
async function main() {
  try {
    // 修改查找文件的方式，使用正确的glob模式
    const htmlFiles = glob.sync('output_*.html', { cwd: __dirname, absolute: true });
    
    if (htmlFiles.length === 0) {
      console.error('未找到任何output HTML文件');
      return;
    }
    
    // 按修改时间排序，获取最新的文件
    const latestHtmlFile = htmlFiles.sort((a, b) => {
      return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime();
    })[0];
    
    console.log(`找到最新的HTML文件: ${latestHtmlFile}`);
    
    // CSS文件路径 - 调整顺序，将highlight.js的样式放在后面，提高优先级
    const cssFilePaths = [
      path.join(__dirname, './md-beautify.css'),
      path.join(__dirname, '../node_modules/highlight.js/styles/atom-one-dark.css'),
    ];
    
    // 读取CSS内容并进行处理，确保代码高亮样式优先级更高
    let mdBeautifyCSS = fs.readFileSync(cssFilePaths[0], 'utf8');
    let highlightCSS = fs.readFileSync(cssFilePaths[1], 'utf8');
    
    // 创建一个新的CSS内容，确保highlight.js的样式优先级更高
    const combinedCSS = mdBeautifyCSS + '\n' + 
                        '/* 提高代码高亮样式的优先级 */\n' + 
                        highlightCSS.replace(/\.hljs/g, '.md-beautify .hljs');
    
    // 使用juice将CSS内联到HTML中
    const htmlContent = fs.readFileSync(latestHtmlFile, 'utf8');
    // 在 options 对象中添加以下选项
    const options = {
      applyStyleTags: true,
      removeStyleTags: false,
      preserveMediaQueries: true,
      preserveFontFaces: true,
      preserveKeyFrames: true,
      preservePseudos: true,
      removeStyleTags: false,
      // 添加以下选项以保留特定的类
      preserveImportant: true
    };
    
    const styledHtml = juice.inlineContent(htmlContent, combinedCSS, options);
    
    // 生成输出文件名
    const outputFileName = `styled_output_${dateFormat(new Date(), 'yyyyMMdd_hhmmss')}.html`;
    const outputFilePath = path.join(__dirname, outputFileName);
    
    // 写入文件
    fs.writeFileSync(outputFilePath, styledHtml, 'utf8');
    
    console.log(`样式内联完成！文件已保存为: ${outputFilePath}`);
    process.exit(0);
  } catch (err) {
    console.error('处理过程中发生错误:', err);
    process.exit(1);
  }
}

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
  main();
}

module.exports = {
  inlineStyles
};