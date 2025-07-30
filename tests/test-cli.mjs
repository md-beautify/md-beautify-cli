#!/usr/bin/env node

/**
 * md-beautify CLI 测试脚本
 * 测试所有主要功能
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

const tests = [
  {
    name: '显示帮助信息',
    command: 'node bin/cli.js --help',
    expectSuccess: true
  },
  {
    name: '显示版本信息',
    command: 'node bin/cli.js --version',
    expectSuccess: true
  },
  {
    name: '转换单个文件',
    command: 'node bin/cli.js convert example/markdown.md -o test-single.html',
    expectSuccess: true
  },
  {
    name: '转换文件（内联样式）',
    command: 'node bin/cli.js convert example/markdown.md -i -o test-inline.html',
    expectSuccess: true
  },
  {
    name: '批量转换',
    command: 'node bin/cli.js convert example/*.md -d test-batch',
    expectSuccess: true
  },
  {
    name: '列出配置',
    command: 'node bin/cli.js config list',
    expectSuccess: true
  },
  {
    name: '设置配置',
    command: 'node bin/cli.js config set theme github',
    expectSuccess: true
  },
  {
    name: '获取配置',
    command: 'node bin/cli.js config get theme',
    expectSuccess: true
  },
  {
    name: '列出主题',
    command: 'node bin/cli.js theme list',
    expectSuccess: true
  },
  {
    name: '设置主题',
    command: 'node bin/cli.js theme use default',
    expectSuccess: true
  },
  {
    name: '预览主题',
    command: 'node bin/cli.js theme preview wechat -o test-preview.html',
    expectSuccess: true
  }
];

console.log(chalk.cyan('🧪 Running md-beautify CLI tests...\n'));

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    console.log(chalk.blue(`Testing: ${test.name}`));
    
    const result = execSync(test.command, { 
      cwd: process.cwd(),
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    if (test.expectSuccess) {
      console.log(chalk.green('✓ PASSED\n'));
      passed++;
    } else {
      console.log(chalk.red('✗ FAILED (expected failure but succeeded)\n'));
      failed++;
    }
    
  } catch (error) {
    if (!test.expectSuccess) {
      console.log(chalk.green('✓ PASSED (expected failure)\n'));
      passed++;
    } else {
      console.log(chalk.red(`✗ FAILED: ${error.message}\n`));
      failed++;
    }
  }
}

console.log(chalk.cyan('📊 Test Results:'));
console.log(`${chalk.green('✓ Passed:')} ${passed}`);
console.log(`${chalk.red('✗ Failed:')} ${failed}`);
console.log(`${chalk.blue('Total:')} ${passed + failed}`);

if (failed === 0) {
  console.log(chalk.green('\n🎉 All tests passed!'));
  process.exit(0);
} else {
  console.log(chalk.red('\n❌ Some tests failed!'));
  process.exit(1);
}