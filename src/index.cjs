const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItContainer = require('markdown-it-container');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItMark = require('markdown-it-mark');
const markdownItSub = require('markdown-it-sub');
const markdownItSup = require('markdown-it-sup');
const markdownItTaskLists = require('markdown-it-task-lists');
const markdownItToc = require('markdown-it-toc-done-right');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItImsize = require('markdown-it-imsize');
const markdownItImageFigures = require('markdown-it-image-figures');
const markdownItMultimdTable = require('markdown-it-multimd-table');

const {markdownParser} = require('./md.mjs');
const {dateFormat} = require('./utils/funcs');

/**
// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

// 添加插件
md.use(markdownItAttrs)
  .use(markdownItEmoji)
  .use(markdownItFootnote)
  .use(markdownItMark)
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItTaskLists)
  .use(markdownItAnchor)
  .use(markdownItToc)
  .use(markdownItImsize)
  .use(markdownItImageFigures, {
    figcaption: true,
    lazy: true,
    async: true,
  })
  .use(markdownItMultimdTable, {
    multiline: true,
    rowspan: true,
    headerless: true,
  });

// 添加自定义容器
['block-1', 'block-2', 'block-3'].forEach(name => {
  md.use(markdownItContainer, name);
});

// 添加列布局容器
md.use(markdownItContainer, 'column');
md.use(markdownItContainer, 'column-left');
md.use(markdownItContainer, 'column-right');

*/

console.log('__dirname: ', __dirname)

const fileFolder = path.join(__dirname, '../local/md-files/');

// 读取 Markdown 文件
// const markdownContent = fs.readFileSync(path.join(__dirname, '../example/markdown.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, 'css-layer.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, '00-why-markdown.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, '01-getting-started.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, '02-text-formatting.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, '03-links-and-images.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, '04-organizing-content.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, '05-showing-code.md'), 'utf8');
const markdownContent = fs.readFileSync(path.join(fileFolder, '06-gfm-extensions.md'), 'utf8');
// const markdownContent = fs.readFileSync(path.join(fileFolder, '06-gfm-extensions.md'), 'utf8');

// 转换 Markdown 为 HTML
// const htmlContent = md.render(markdownContent);
const htmlContent = markdownParser.render(markdownContent);

// 创建完整的 HTML 文档
const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Beautiful</title>
  <link rel="stylesheet" href="./md-beautify.css">
  <link rel="stylesheet" href="../node_modules/highlight.js/styles/github-dark.css">
  <link rel="stylesheet" href="./custom.css">
</head>
<body>
  <div id="writing-content" class="writing-content" style="max-width:677px;margin:0 auto;">
    <section id="nice" data-tool="md-beautify" data-website="https://www.mdnice.com" class="md-beautify">
      ${htmlContent}
    </section>
  </div>
</body>
</html>`;

const outFileName = `output_${dateFormat(new Date(), 'yyyyMMdd_hhmmss')}.html`;
// 写入 HTML 文件
fs.writeFileSync(path.join(__dirname, outFileName), fullHtml, 'utf8');

console.log(`转换完成！HTML 文件已保存为 ${outFileName}`);

process.exit(0)