import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import chokidar from 'chokidar';
import juice from 'juice';
import { markdownParser } from '../../md.mjs';
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

  // 处理glob模式或单个文件
  const files = await getInputFiles(input);
  
  if (files.length === 0) {
    logError(`No markdown files found matching: ${input}`);
    return;
  }

  logInfo(`Found ${files.length} file(s) to convert`);

  if (options.watch) {
    await watchFiles(files, options);
  } else {
    await convertFiles(files, options);
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
  
  // 读取CSS文件
  const cssFiles = [
    path.resolve(process.cwd(), 'src/md-beautify.css'),
    path.resolve(process.cwd(), 'src/custom.css')
  ];
  
  let styles = '';
  
  // 读取所有CSS文件内容
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
  
  // 添加highlight.js样式
  const highlightCssPath = path.resolve(process.cwd(), 'node_modules/highlight.js/styles/github-dark.css');
  if (fileExists(highlightCssPath)) {
    try {
      const highlightCss = fs.readFileSync(highlightCssPath, 'utf8');
      styles += highlightCss + '\n';
    } catch (error) {
      logWarning(`Could not read highlight.js CSS: ${error.message}`);
    }
  }
  
  const timestamp = new Date().toISOString();
  
  // 构建基础HTML
  const baseHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Beautiful</title>
  <meta name="generator" content="md-beautify">
  <meta name="created" content="${timestamp}">
  ${inline ? '' : generateExternalCssLinks()}
  ${inline ? `<style>${styles}</style>` : ''}
</head>
<body>
  <div id="writing-content" class="writing-content" style="max-width:677px;margin:0 auto;padding-bottom:20px;">
    <section id="nice" data-tool="md-beautify" data-website="https://github.com/md-beautify/md-beautify-cli" class="md-beautify">
      ${htmlContent}
    </section>
  </div>
</body>
</html>`;

  if (inline && styles) {
    try {
      // 使用juice进行CSS内联
      const inlinedHtml = juice(baseHtml);
      return inlinedHtml;
    } catch (error) {
      logWarning(`CSS inlining failed, falling back to embedded styles: ${error.message}`);
      return baseHtml;
    }
  }
  
  return baseHtml;
}

/**
 * 生成外部CSS链接（当不使用内联样式时）
 * @returns {string}
 */
function generateExternalCssLinks() {
  // 注意：这里使用相对路径，假设CSS文件会被复制到输出目录
  return `
  <link rel="stylesheet" href="md-beautify.css">
  <link rel="stylesheet" href="custom.css">
  <link rel="stylesheet" href="highlight.css">
  `;
}

/**
 * 复制CSS文件到输出目录（当不使用内联样式时）
 * @param {string} outputDir 
 */
function copyCssFiles(outputDir) {
  const cssFiles = [
    { src: 'src/md-beautify.css', dest: 'md-beautify.css' },
    { src: 'src/custom.css', dest: 'custom.css' },
    { src: 'node_modules/highlight.js/styles/github-dark.css', dest: 'highlight.css' }
  ];
  
  cssFiles.forEach(({ src, dest }) => {
    const srcPath = path.resolve(process.cwd(), src);
    const destPath = path.join(outputDir, dest);
    
    if (fileExists(srcPath)) {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (error) {
        logWarning(`Failed to copy ${src}: ${error.message}`);
      }
    }
  });
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
    return path.resolve(options.output);
  }
  
  // 如果指定了输出目录
  if (options.outputDir) {
    ensureDir(options.outputDir);
    
    // 如果不使用内联样式，复制CSS文件到输出目录
    if (options.inline === false) {
      copyCssFiles(options.outputDir);
    }
    
    const filename = options.noTimestamp 
      ? `${inputName}.html`
      : generateTimestampFilename(inputName);
    return path.join(options.outputDir, filename);
  }
  
  // 默认输出到同目录
  const filename = options.noTimestamp 
    ? `${inputName}.html`
    : generateTimestampFilename(inputName);
  
  return path.join(inputDir, filename);
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