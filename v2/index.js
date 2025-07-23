const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

// 添加插件
md.use(require('markdown-it-container'));
md.use(require('markdown-it-attrs'));
md.use(require('markdown-it-emoji'));
md.use(require('markdown-it-imsize'));
md.use(require('markdown-it-sub'));
md.use(require('markdown-it-sup'));
md.use(require('markdown-it-mark'));
md.use(require('markdown-it-footnote'));
md.use(require('markdown-it-task-lists'));

// 添加自定义容器
const container = require('markdown-it-container');

// 添加块容器
['block-1', 'block-2', 'block-3'].forEach(name => {
  md.use(container, name);
});

// 添加列布局容器
md.use(container, 'column');
md.use(container, 'column-left');
md.use(container, 'column-right');

// 自定义渲染器
const originalRender = md.render.bind(md);
md.render = function(src) {
  let html = originalRender(src);
  
  // 添加特定的类和结构
  html = html
    // 为标题添加类和结构
    .replace(/<h1>/g, '<h1 data-tool="md-beautify"><span class="prefix" style="display: none;"></span><span class="content">')
    .replace(/<\/h1>/g, '</span><span class="suffix" style="display: none;"></span></h1>')
    
    .replace(/<h2>/g, '<h2 data-tool="md-beautify"><span class="prefix"></span><span class="content">')
    .replace(/<\/h2>/g, '</span><span class="suffix"></span></h2>')
    
    .replace(/<h3>/g, '<h3 data-tool="md-beautify"><span class="prefix" style="display: none;"></span><span class="content">')
    .replace(/<\/h3>/g, '</span><span class="suffix" style="display: none;"></span></h3>')
    
    // 为段落添加类
    .replace(/<p>/g, '<p data-tool="md-beautify">')
    
    // 为列表添加类
    .replace(/<ul>/g, '<ul data-tool="md-beautify">')
    .replace(/<ol>/g, '<ol data-tool="md-beautify">')
    
    // 为引用添加类和结构
    .replace(/<blockquote>/g, '<blockquote class="custom-blockquote multiquote-1" data-tool="md-beautify"><span style="display: block; color: rgba(64, 184, 250, 0.5); font-size: 28px; line-height: 1.5em; letter-spacing: 0em; text-align: left; font-weight: bold;">❝</span>')
    
    // 为表格添加类
    .replace(/<table>/g, '<table data-tool="md-beautify">')
    
    // 为水平线添加类
    .replace(/<hr>/g, '<hr data-tool="md-beautify">')
    
    // 为列表项添加结构
    .replace(/<li>/g, '<li><section>')
    .replace(/<\/li>/g, '</section></li>')
    
    // 为代码块添加类
    .replace(/<pre><code class="language-(\w+)">/g, '<pre><code class="language-$1" data-tool="md-beautify">');
  
  return html;
};

// 主函数
function convertMarkdownToHtml(inputFile, outputFile) {
  try {
    // 读取 Markdown 文件
    const markdownContent = fs.readFileSync(inputFile, 'utf8');

    // 转换 Markdown 为 HTML
    const htmlContent = md.render(markdownContent);

    // 创建完整的 HTML 文档
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Beautiful</title>
  <link rel="stylesheet" href="../md-beautify.css">
</head>
<body>
  <div id="writing-content" class="writing-content">
    <section id="nice" data-tool="md-beautify" data-website="https://www.mdnice.com" class="md-beautify">
      ${htmlContent}
    </section>
  </div>
</body>
</html>`;

    // 写入 HTML 文件
    fs.writeFileSync(outputFile, fullHtml, 'utf8');
    console.log(`转换完成！HTML 文件已保存为 ${outputFile}`);
    return true;
  } catch (error) {
    console.error('转换过程中发生错误:', error);
    return false;
  }
}

// 命令行参数处理
if (require.main === module) {
  const args = process.argv.slice(2);
  const inputFile = args[0] || path.join(__dirname, 'markdown.md');
  const outputFile = args[1] || path.join(__dirname, 'output.html');
  
  convertMarkdownToHtml(inputFile, outputFile);
}

module.exports = {
  convertMarkdownToHtml
};