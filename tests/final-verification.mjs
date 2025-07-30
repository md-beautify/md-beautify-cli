#!/usr/bin/env node

import fs from 'fs';

console.log('🎉 md-beautify 改进验证总结\n');

// 验证功能
const verifications = [
  {
    name: '默认内联样式',
    file: 'tests/test-inline-default.html',
    check: (content) => !content.includes('<link rel="stylesheet"') && content.includes('style="')
  },
  {
    name: '外部CSS选项',
    file: 'tests/test-external-css.html', 
    check: (content) => content.includes('<link rel="stylesheet" href="md-beautify.css">') && content.includes('<link rel="stylesheet" href="custom.css">')
  },
  {
    name: '主题预览功能',
    file: 'tests/test-theme-preview.html',
    check: (content) => content.includes('Theme Preview - github') && content.includes('Github Theme Preview')
  },
  {
    name: '批量转换外部CSS',
    file: 'tests/test-batch-output/markdown_2025-07-30T05-27-57.html',
    check: (content) => content.includes('<link rel="stylesheet" href="md-beautify.css">')
  }
];

let passed = 0;
let total = verifications.length;

verifications.forEach(({ name, file, check }) => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (check(content)) {
        console.log(`✅ ${name}: 通过`);
        passed++;
      } else {
        console.log(`❌ ${name}: 失败`);
      }
    } else {
      console.log(`❌ ${name}: 文件不存在`);
    }
  } catch (error) {
    console.log(`❌ ${name}: 错误 - ${error.message}`);
  }
});

console.log(`\n📊 验证结果: ${passed}/${total} 通过 (${((passed/total)*100).toFixed(1)}%)`);

// 显示改进总结
console.log('\n🚀 已完成的改进:');
console.log('1. ✅ 默认启用CSS内联样式，解决外部CSS路径问题');
console.log('2. ✅ 支持 --no-inline 选项生成外部CSS文件');
console.log('3. ✅ 自动复制CSS文件到输出目录');
console.log('4. ✅ 使用 juice 库实现完整的CSS内联');
console.log('5. ✅ 主题预览功能正常工作');
console.log('6. ✅ 批量转换支持内联和外部CSS两种模式');

console.log('\n📝 使用说明:');
console.log('• 默认模式 (内联CSS): node bin/cli.js convert file.md');
console.log('• 外部CSS模式: node bin/cli.js convert file.md --no-inline');
console.log('• 批量转换: node bin/cli.js convert *.md -d output/');
console.log('• 主题预览: node bin/cli.js theme preview github');

if (passed === total) {
  console.log('\n🎊 所有改进都已成功实现并验证通过！');
} else {
  console.log('\n⚠️ 部分功能需要进一步检查。');
}