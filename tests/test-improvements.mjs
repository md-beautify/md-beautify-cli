#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing md-beautify improvements...\n');

let passed = 0;
let failed = 0;

function test(name, command, expectedCondition) {
  try {
    console.log(`Testing: ${name}`);
    const output = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
    
    if (expectedCondition(output)) {
      console.log(`✅ PASSED: ${name}\n`);
      passed++;
    } else {
      console.log(`❌ FAILED: ${name}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED: ${name} - ${error.message}\n`);
    failed++;
  }
}

function fileTest(name, filePath, expectedCondition) {
  try {
    console.log(`Testing: ${name}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ FAILED: ${name} - File does not exist: ${filePath}\n`);
      failed++;
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    
    if (expectedCondition(content, stats)) {
      console.log(`✅ PASSED: ${name}\n`);
      passed++;
    } else {
      console.log(`❌ FAILED: ${name}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED: ${name} - ${error.message}\n`);
    failed++;
  }
}

// 清理之前的测试文件
const testFiles = [
  'test-inline-default.html',
  'test-inline-explicit.html', 
  'test-external-css.html',
  'test-batch-output'
];

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (fs.statSync(file).isDirectory()) {
      fs.rmSync(file, { recursive: true, force: true });
    } else {
      fs.unlinkSync(file);
    }
  }
});

console.log('🧹 Cleaned up previous test files\n');

// 测试1: 默认内联样式转换
test(
  'Default inline styles conversion',
  'node bin/cli.js convert example/markdown.md -o test-inline-default.html',
  (output) => output.includes('Successfully converted')
);

// 验证默认内联样式文件
fileTest(
  'Default inline styles file verification',
  'test-inline-default.html',
  (content, stats) => {
    return !content.includes('<link rel="stylesheet"') && 
           content.includes('style="') && 
           stats.size > 50000; // 内联CSS应该使文件更大
  }
);

// 测试2: 明确指定内联样式
test(
  'Explicit inline styles conversion',
  'node bin/cli.js convert example/markdown.md -o test-inline-explicit.html --inline',
  (output) => output.includes('Successfully converted')
);

// 验证明确内联样式文件
fileTest(
  'Explicit inline styles file verification',
  'test-inline-explicit.html',
  (content, stats) => {
    return !content.includes('<link rel="stylesheet"') && 
           content.includes('style="') && 
           stats.size > 50000;
  }
);

// 测试3: 外部CSS文件转换
test(
  'External CSS conversion',
  'node bin/cli.js convert example/markdown.md -o test-external-css.html --no-inline',
  (output) => output.includes('Successfully converted')
);

// 验证外部CSS文件
fileTest(
  'External CSS file verification',
  'test-external-css.html',
  (content, stats) => {
    return content.includes('<link rel="stylesheet" href="md-beautify.css">') && 
           content.includes('<link rel="stylesheet" href="custom.css">') && 
           content.includes('<link rel="stylesheet" href="highlight.css">') &&
           stats.size < 20000; // 外部CSS应该使文件更小
  }
);

// 测试4: 批量转换到输出目录（默认内联）
test(
  'Batch conversion with inline styles',
  'node bin/cli.js convert example/*.md -d test-batch-output',
  (output) => output.includes('Successfully converted')
);

// 验证批量转换文件
try {
  console.log('Testing: Batch conversion file verification');
  
  if (!fs.existsSync('test-batch-output')) {
    console.log('❌ FAILED: Batch conversion file verification - Directory does not exist\n');
    failed++;
  } else {
    const stats = fs.statSync('test-batch-output');
    if (!stats.isDirectory()) {
      console.log('❌ FAILED: Batch conversion file verification - Not a directory\n');
      failed++;
    } else {
      const files = fs.readdirSync('test-batch-output');
      const htmlFiles = files.filter(f => f.endsWith('.html'));
      
      if (htmlFiles.length === 0) {
        console.log('❌ FAILED: Batch conversion file verification - No HTML files found\n');
        failed++;
      } else {
        // 检查第一个HTML文件是否使用内联样式
        const htmlContent = fs.readFileSync(path.join('test-batch-output', htmlFiles[0]), 'utf8');
        if (!htmlContent.includes('<link rel="stylesheet"') && htmlContent.includes('style="')) {
          console.log('✅ PASSED: Batch conversion file verification\n');
          passed++;
        } else {
          console.log('❌ FAILED: Batch conversion file verification - Inline styles not found\n');
          failed++;
        }
      }
    }
  }
} catch (error) {
  console.log(`❌ FAILED: Batch conversion file verification - ${error.message}\n`);
  failed++;
}

// 测试5: 批量转换到输出目录（外部CSS）
test(
  'Batch conversion with external CSS',
  'node bin/cli.js convert example/*.md -d test-batch-output --no-inline',
  (output) => output.includes('Successfully converted')
);

// 验证批量转换外部CSS文件
try {
  console.log('Testing: Batch conversion external CSS verification');
  
  if (!fs.existsSync('test-batch-output')) {
    console.log('❌ FAILED: Batch conversion external CSS verification - Directory does not exist\n');
    failed++;
  } else {
    const stats = fs.statSync('test-batch-output');
    if (!stats.isDirectory()) {
      console.log('❌ FAILED: Batch conversion external CSS verification - Not a directory\n');
      failed++;
    } else {
      const files = fs.readdirSync('test-batch-output');
      const htmlFiles = files.filter(f => f.endsWith('.html'));
      const cssFiles = files.filter(f => f.endsWith('.css'));
      
      console.log(`  Found ${htmlFiles.length} HTML files and ${cssFiles.length} CSS files`);
      console.log(`  CSS files: ${cssFiles.join(', ')}`);
      
      if (htmlFiles.length === 0) {
        console.log('❌ FAILED: Batch conversion external CSS verification - No HTML files found\n');
        failed++;
      } else if (cssFiles.length === 0) {
        console.log('❌ FAILED: Batch conversion external CSS verification - No CSS files found\n');
        failed++;
      } else {
        // 检查是否有CSS文件被复制
        const expectedCssFiles = ['md-beautify.css', 'custom.css', 'highlight.css'];
        const hasCssFiles = expectedCssFiles.every(cssFile => cssFiles.includes(cssFile));
        
        // 检查HTML文件是否引用外部CSS
        const htmlContent = fs.readFileSync(path.join('test-batch-output', htmlFiles[0]), 'utf8');
        const hasExternalCss = htmlContent.includes('<link rel="stylesheet"');
        
        console.log(`  Has all CSS files: ${hasCssFiles}`);
        console.log(`  Has external CSS links: ${hasExternalCss}`);
        
        if (hasCssFiles && hasExternalCss) {
          console.log('✅ PASSED: Batch conversion external CSS verification\n');
          passed++;
        } else {
          console.log('❌ FAILED: Batch conversion external CSS verification - External CSS not properly configured\n');
          failed++;
        }
      }
    }
  }
} catch (error) {
  console.log(`❌ FAILED: Batch conversion external CSS verification - ${error.message}\n`);
  failed++;
}

// 测试6: 主题预览功能
test(
  'Theme preview functionality',
  'node bin/cli.js theme preview github -o test-theme-preview.html',
  (output) => output.includes('Theme preview generated')
);

// 验证主题预览文件
fileTest(
  'Theme preview file verification',
  'test-theme-preview.html',
  (content, stats) => {
    return content.includes('<!DOCTYPE html>') && 
           content.includes('Theme Preview - github') &&
           content.includes('Github Theme Preview') &&
           stats.size > 1000;
  }
);

// 显示测试结果
console.log('📊 Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! The improvements are working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please check the implementation.');
  process.exit(1);
}