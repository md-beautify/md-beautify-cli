import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import chokidar from 'chokidar';
import juice from 'juice';
import { markdownParser } from '../../md.mjs';
import { readConfig } from '../config/configManager.js';
import { 
  fileExists, 
  dirExists, 
  ensureDir, 
  getFileExtension, 
  generateTimestampFilename,
  formatFileSize,
  createSpinner,
  logSuccess,
  logError,
  logWarning,
  logInfo
} from '../../utils/helpers.js';
import { themeManager } from '../../utils/themeManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 转换命令的工作函数
 * @param {Command} command 
 * @param {Object} options 
 */
export async function run(command, options) {
  const input = command.args[0];
  
  if (!input) {
    logError('Please specify input file(s)');
    command.help();
    return;
  }

  // 读取配置文件并合并选项
  const config = readConfig();
  const mergedOptions = {
    ...config,  // 配置文件设置
    ...options  // 命令行选项（优先级更高）
  };
  
  // 处理timestamp选项：commander.js将--no-timestamp映射为options.timestamp = false
  // 如果没有指定--no-timestamp，使用配置文件设置
  if (!('timestamp' in options)) {
    mergedOptions.timestamp = config.timestamp;
  }
  
  // 处理inline选项：commander.js将--no-inline映射为options.inline = false
  // 如果没有指定--no-inline，使用配置文件设置
  if (!('inline' in options)) {
    mergedOptions.inline = config.inline;
  }

  // 处理glob模式或单个文件
  const files = await getInputFiles(input);
  
  if (files.length === 0) {
    logError(`No markdown files found matching: ${input}`);
    return;
  }

  logInfo(`Found ${files.length} file(s) to convert`);

  // 参数验证：根据文件数量验证参数使用是否正确
  validateParameters(files.length, mergedOptions);

  if (mergedOptions.watch) {
    await watchFiles(files, mergedOptions);
  } else {
    await convertFiles(files, mergedOptions);
  }
}

/**
 * 获取输入文件列表
 * @param {string} input 
 * @returns {Promise<string[]>}
 */
async function getInputFiles(input) {
  try {
    // 如果是具体文件路径
    if (fileExists(input)) {
      return [input];
    }
    
    // 如果包含通配符，使用glob
    if (input.includes('*')) {
      const files = await glob(input);
      return files.filter(file => getFileExtension(file) === '.md');
    }
    
    // 如果是目录
    if (dirExists(input)) {
      const files = await glob(path.join(input, '**/*.md'));
      return files;
    }
    
    return [];
  } catch (error) {
    logError(`Error reading input: ${error.message}`);
    return [];
  }
}

/**
 * 转换文件列表
 * @param {string[]} files 
 * @param {Object} options 
 */
async function convertFiles(files, options) {
  const spinner = createSpinner('Converting files...');
  spinner.start();
  
  try {
    const results = [];
    
    for (const file of files) {
      const result = await convertSingleFile(file, options);
      if (result) {
        results.push(result);
      }
    }
    
    spinner.stop();
    
    // 显示转换结果
    console.log();
    logSuccess(`Successfully converted ${results.length} file(s):`);
    
    results.forEach(result => {
      console.log(`  ${chalk.cyan(result.input)} → ${chalk.green(result.output)} (${result.size})`);
    });
    
    // 如果只有一个文件且启用了复制功能
    if (results.length === 1 && options.copy) {
      await copyToClipboard(results[0].content);
    }
    
  } catch (error) {
    spinner.stop();
    logError(`Conversion failed: ${error.message}`);
  }
}

/**
 * 转换单个文件
 * @param {string} inputFile 
 * @param {Object} options 
 * @returns {Promise<Object|null>}
 */
async function convertSingleFile(inputFile, options) {
  try {
    // 读取markdown文件
    const markdownContent = fs.readFileSync(inputFile, 'utf8');
    
    // 转换为HTML
    const htmlContent = markdownParser.render(markdownContent);
    
    // 生成完整的HTML文档
    const fullHtml = await generateFullHtml(htmlContent, options);
    
    // 确定输出文件路径
    const outputFile = getOutputPath(inputFile, options);
    
    // 确保输出目录存在
    ensureDir(path.dirname(outputFile));
    
    // 写入文件
    fs.writeFileSync(outputFile, fullHtml, 'utf8');
    
    // 获取文件大小
    const stats = fs.statSync(outputFile);
    const size = formatFileSize(stats.size);
    
    return {
      input: inputFile,
      output: outputFile,
      content: fullHtml,
      size
    };
    
  } catch (error) {
    logError(`Failed to convert ${inputFile}: ${error.message}`);
    return null;
  }
}

/**
 * 生成完整的HTML文档
 * @param {string} htmlContent 
 * @param {Object} options 
 * @returns {Promise<string>}
 */
async function generateFullHtml(htmlContent, options) {
  const theme = options.theme || 'default';
  // 默认启用内联样式，除非明确指定--no-inline
  const inline = options.inline !== false && !options.noInline;
  
  let styles = '';
  
  if (theme === 'default') {
    // 读取默认基础样式（md-beautify.css + custom.css）
    const cssFiles = [
      path.resolve(__dirname, '../../md-beautify.css'),
      path.resolve(__dirname, '../../custom.css')
    ];
    for (const cssFile of cssFiles) {
      if (fileExists(cssFile)) {
        try {
          const cssContent = fs.readFileSync(cssFile, 'utf8');
          styles += cssContent + '\n';
        } catch (error) {
          logWarning(`Could not read CSS file ${cssFile}: ${error.message}`);
        }
      }
    }
  } else {
    // 非 default 主题，使用主题管理器加载主题 CSS（已自动合并 custom.css）
    try {
      styles = themeManager.getThemeCSS(theme);
    } catch (error) {
      logWarning(`Could not load theme CSS: ${error.message}`);
      // 回退到默认基础样式
      try {
        const fallbackDefault = fs.readFileSync(path.resolve(__dirname, '../../md-beautify.css'), 'utf8');
        const fallbackCustom = fs.readFileSync(path.resolve(__dirname, '../../custom.css'), 'utf8');
        styles = `${fallbackDefault}\n${fallbackCustom}`;
      } catch (fallbackError) {
        logWarning(`Could not load default styles: ${fallbackError.message}`);
      }
    }
  }
  
  // 添加 highlight.js 样式，提升选择器优先级（作用域到 .md-beautify）
  let highlightCssScoped = '';
  const highlightCssPath = path.resolve(__dirname, '../../../node_modules/highlight.js/styles/github-dark.css');
  if (fileExists(highlightCssPath)) {
    try {
      const highlightCss = fs.readFileSync(highlightCssPath, 'utf8');
      highlightCssScoped = scopeCssToMdBeautify(highlightCss) + '\n';
    } catch (error) {
      logWarning(`Could not read highlight.js CSS: ${error.message}`);
    }
  }
  
  const combinedStyles = styles + highlightCssScoped;
  const timestamp = new Date().toISOString();
  
  const baseHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Beautiful</title>
  <meta name="generator" content="md-beautify">
  <meta name="created" content="${timestamp}">
  ${`<style>${combinedStyles}</style>`}
</head>
<body>
  <div id="writing-content" class="writing-content" style="max-width:677px;margin:0 auto;padding-bottom:20px;">
    <section id="nice" data-tool="md-beautify" data-website="https://github.com/md-beautify/md-beautify-cli" class="md-beautify">
      ${htmlContent}
    </section>
  </div>
</body>
</html>`;

  // 在最终返回前插入悬浮复制按钮。复制的内容来自未注入辅助元素的完整HTML（含<head>中的<style>）。
  const injectToolbar = (html, copySource) => {
    const escapeForScript = (s) => (s || '').replace(/<\/script/gi, '<\\/script>');
    const toolbarBlock = `
<!-- mb-floating-toolbar start -->
<style id="mb-toolbar-style">
  .mb-toolbar{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;}
  .mb-btn{appearance:none;border:none;border-radius:8px;padding:10px 14px;background:#1677ff;color:#fff;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.15);cursor:pointer;opacity:.95;transition:opacity .2s,transform .08s;}
  .mb-btn:hover{opacity:1}
  .mb-btn:active{transform:scale(.98)}
  .mb-toast{position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:rgba(0,0,0,.78);color:#fff;padding:8px 12px;border-radius:6px;font-size:13px;z-index:2147483647;opacity:0;transition:opacity .2s}
  .mb-toast.show{opacity:1}
</style>
<div class="mb-toolbar" aria-label="工具栏" role="region">
  <button id="mb-copy-btn" class="mb-btn" type="button" title="复制富文本内容">复制</button>
</div>
<script id="mb-copy-source" type="text/plain">${escapeForScript(copySource)}</script>
<script>(function(){function toast(m){var t=document.createElement('div');t.className='mb-toast';t.textContent=m;document.body.appendChild(t);requestAnimationFrame(function(){t.classList.add('show')});setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove()},200);},1500)}function legacyCopy(txt){var ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';ta.style.pointerEvents='none';ta.style.zIndex='-1';document.body.appendChild(ta);ta.focus();ta.select();try{var ok=document.execCommand('copy');toast(ok?'已复制到剪贴板':'复制失败');}catch(e){toast('复制失败');}document.body.removeChild(ta);}var btn=document.getElementById('mb-copy-btn');if(!btn)return;btn.addEventListener('click',async function(){var src=document.getElementById('mb-copy-source');var html=src?src.textContent:document.documentElement.outerHTML;try{if(navigator.clipboard&&navigator.clipboard.write){var blob=new Blob([html],{type:'text/html'});var item=new ClipboardItem({'text/html':blob});await navigator.clipboard.write([item]);toast('已复制富文本到剪贴板');}else if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(html);toast('已复制HTML文本到剪贴板');}else{legacyCopy(html)}}catch(e){legacyCopy(html)}});})();</script>
<!-- mb-floating-toolbar end -->
`;
    // 插入到 </body> 之前
    return html.replace('</body>', `${toolbarBlock}</body>`);
  };

  if (inline) {
    try {
      // 使用juice的标准方法而不是inlineContent，避免样式重复
      const juiceOptions = {
        applyStyleTags: true,     // 处理文档中的<style>标签内的CSS规则
        removeStyleTags: true,    // 处理完后移除所有原始<style>标签
        preserveMediaQueries: false,  // 不保留媒体查询规则
        preserveFontFaces: false,     // 不保留字体规则
        preserveKeyFrames: false,     // 不保留关键帧动画规则
        preservePseudos: false,       // 不保留伪元素规则
        inlinePseudoElements: true,   // 将伪元素转换为实际的DOM元素
        insertPreservedExtraCss: false, // 不插入任何额外的CSS
        resolveCSSVariables: true     // 解析CSS变量
      };

      // baseHtml已经包含了样式，直接使用juice处理即可
      const inlinedHtml = juice(baseHtml, juiceOptions);
      // 返回插入悬浮复制按钮后的HTML（复制源是未注入辅助元素的完整HTML，即 inlinedHtml 本身）
      return injectToolbar(inlinedHtml, inlinedHtml);
    } catch (error) {
      logWarning(`Inlining failed, returning base HTML: ${error.message}`);
      return injectToolbar(baseHtml, baseHtml);
    }
  }
  
  return injectToolbar(baseHtml, baseHtml);
}

/**
 * 生成外部CSS链接（当不使用内联样式时）
 * @returns {string}
 */
function generateExternalCssLinks(theme) {
  // 非内联模式下，根据主题生成正确的外链
  if (theme && theme !== 'default') {
    return `\n  <link rel="stylesheet" href="theme.css">\n  <link rel="stylesheet" href="highlight.css">\n  `;
  }
  return `\n  <link rel="stylesheet" href="md-beautify.css">\n  <link rel="stylesheet" href="custom.css">\n  <link rel="stylesheet" href="highlight.css">\n  `;
}

/**
 * 复制CSS文件到输出目录（当不使用内联样式时）
 * @param {string} outputDir 
 */
function copyCssFiles(outputDir, theme) {
  // 根据主题复制/写入 CSS 文件到输出目录
  ensureDir(outputDir);
  if (theme && theme !== 'default') {
    // 写入主题 CSS（包含 custom.css）
    try {
      const themeCss = themeManager.getThemeCSS(theme);
      fs.writeFileSync(path.join(outputDir, 'theme.css'), themeCss, 'utf8');
    } catch (error) {
      logWarning(`Failed to write theme.css: ${error.message}`);
    }
  } else {
    // 复制默认样式
    const cssFiles = [
      { src: path.resolve(__dirname, '../../md-beautify.css'), dest: 'md-beautify.css' },
      { src: path.resolve(__dirname, '../../custom.css'), dest: 'custom.css' }
    ];
    cssFiles.forEach(({ src, dest }) => {
      if (fileExists(src)) {
        try {
          fs.copyFileSync(src, path.join(outputDir, dest));
        } catch (error) {
          logWarning(`Failed to copy ${src}: ${error.message}`);
        }
      }
    });
  }
  // 写入作用域后的 highlight.css（所有主题通用）
  const hlSrc = path.resolve(__dirname, '../../../node_modules/highlight.js/styles/github-dark.css');
  if (fileExists(hlSrc)) {
    try {
      const css = fs.readFileSync(hlSrc, 'utf8');
      const scopedCss = scopeCssToMdBeautify(css);
      fs.writeFileSync(path.join(outputDir, 'highlight.css'), scopedCss, 'utf8');
    } catch (error) {
      logWarning(`Failed to copy highlight.css: ${error.message}`);
    }
  }
}

/**
 * 参数验证：根据文件数量验证参数使用是否正确
 * @param {number} fileCount 
 * @param {Object} options 
 */
function validateParameters(fileCount, options) {
  // 单个文件转换
  if (fileCount === 1) {
    // 单个文件可以使用 --output 或默认行为
    if (options.outputDir) {
      logWarning('Using --output-dir for single file conversion is not recommended, use --output instead');
    }
  } 
  // 批量转换
  else {
    // 批量转换应该使用 --output-dir
    if (options.output && !options.output.endsWith(path.sep) && !options.output.endsWith('/')) {
      const parsed = path.parse(options.output);
      if (parsed.ext) {
        // 如果指定了文件路径（有扩展名），应该报错
        logError('Cannot use --output with a file path for batch conversion, use --output-dir instead');
        process.exit(1);
      }
    }
    
    // 如果同时指定了 --output 和 --output-dir，给出警告
    if (options.output && options.outputDir) {
      logWarning('Both --output and --output-dir specified, --output-dir will be ignored');
    }
  }
}

/**
 * 获取输出文件路径
 * @param {string} inputFile 
 * @param {Object} options 
 * @returns {string}
 */
function getOutputPath(inputFile, options) {
  const inputDir = path.dirname(inputFile);
  const inputName = path.basename(inputFile, '.md');
  
  // 如果指定了输出文件
  if (options.output) {
    const fullPath = path.resolve(options.output);
    const parsed = path.parse(fullPath);
    if (parsed.ext) {
      const outputDir = path.dirname(fullPath);
      // 非内联模式下不再复制CSS文件，统一通过 <style> 内嵌样式
      return fullPath;
    } else {
      ensureDir(fullPath);
      const noTimestamp = options.timestamp === false;
      const filename = noTimestamp ? `${inputName}.html` : generateTimestampFilename(inputName);
      const finalPath = path.join(fullPath, filename);
      // 非内联模式下不再复制CSS文件，统一通过 <style> 内嵌样式
      return finalPath;
    }
  }
  
  // 如果指定了输出目录（兼容参数）
  if (options.outputDir) {
    ensureDir(options.outputDir);
    // 非内联模式下不再复制CSS文件，统一通过 <style> 内嵌样式
    const noTimestamp = options.timestamp === false;
    const filename = noTimestamp 
      ? `${inputName}.html`
      : generateTimestampFilename(inputName);
    return path.join(options.outputDir, filename);
  }
  
  // 默认输出到同目录
  // commander.js 将 --no-timestamp 转换为 options.timestamp = false
  const noTimestamp = options.timestamp === false;
  const filename = noTimestamp 
    ? `${inputName}.html`
    : generateTimestampFilename(inputName);

  const finalDefaultPath = path.join(inputDir, filename);
  // 非内联模式下不再复制CSS文件，统一通过 <style> 内嵌样式
  return finalDefaultPath;
}

/**
 * 复制内容到剪贴板
 * @param {string} content 
 */
async function copyToClipboard(content) {
  try {
    await clipboardy.write(content);
    logSuccess('Content copied to clipboard!');
  } catch (error) {
    logWarning(`Failed to copy to clipboard: ${error.message}`);
  }
}

/**
 * 监听文件变化
 * @param {string[]} files 
 * @param {Object} options 
 */
async function watchFiles(files, options) {
  logInfo('Watching for file changes... Press Ctrl+C to stop.');
  
  const watcher = chokidar.watch(files, {
    persistent: true,
    ignoreInitial: false
  });
  
  watcher.on('change', async (filePath) => {
    console.log();
    logInfo(`File changed: ${filePath}`);
    await convertSingleFile(filePath, options);
  });
  
  watcher.on('error', (error) => {
    logError(`Watcher error: ${error.message}`);
  });
  
  // 处理退出信号
  process.on('SIGINT', () => {
    console.log();
    logInfo('Stopping file watcher...');
    watcher.close();
    process.exit(0);
  });
}

// 轻量级 CSS 作用域工具：将顶层选择器前缀为 .md-beautify
function scopeCssToMdBeautify(css) {
  try {
    let out = '';
    const parts = css.split('}');
    for (let part of parts) {
      if (!part.trim()) continue;
      const seg = part.split('{');
      if (seg.length < 2) continue;
      const selector = seg[0].trim();
      const body = seg.slice(1).join('{');
      // 忽略 @font-face、@keyframes 等 at-rule
      if (selector.startsWith('@')) {
        out += selector + '{' + body + '}\n';
        continue;
      }
      // 多选择器逗号分隔处理
      const prefixed = selector
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length)
        .map(s => `.md-beautify ${s}`)
        .join(', ');
      out += `${prefixed}{${body}}\n`;
    }
    return out;
  } catch (e) {
    // 兜底：原样返回
    return css;
  }
}