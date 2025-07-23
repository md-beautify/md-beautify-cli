#!/usr/bin/env node

const { convertMarkdownToHtml } = require('./index');
const path = require('path');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
使用方法: node cli.js [输入文件] [输出文件]

参数:
  输入文件  要转换的 Markdown 文件路径 (默认: markdown.md)
  输出文件  生成的 HTML 文件路径 (默认: output.html)

选项:
  --help, -h  显示帮助信息
  `);
  process.exit(0);
}

console.log('__dirname: ', __dirname)

const inputFile = args[0] || path.join(__dirname, '../markdown.md');
const outputFile = args[1] || path.join(__dirname, 'output.html');

console.log(`正在将 ${inputFile} 转换为 ${outputFile}...`);
const result = convertMarkdownToHtml(inputFile, outputFile);

if (result) {
  console.log('转换成功！');
  process.exit(0);
} else {
  console.error('转换失败！');
  process.exit(1);
}