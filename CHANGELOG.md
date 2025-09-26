# Changelog

## v1.0.2 - 2025-09-26

### 改进
- **内联模式（--inline）**：
  - 使用 `juice.inlineContent` 将 CSS 规则下沉为元素的 `style` 属性，同时保留 `<style>` 标签本身。
  - 启用 `preservePseudos`、`preserveMediaQueries`、`preserveFontFaces`、`preserveKeyFrames` 等选项，确保伪元素、媒体查询、字体与关键帧继续生效。
  - 复制单节点时，可完整保留样式；页面渲染时，伪元素与复杂选择器依旧正常工作。

- **非内联模式（--no-inline）**：
  - 不再生成 `<link rel="stylesheet">` 外链，也不再复制 CSS 文件到输出目录。
  - 统一将合并后的 CSS（主题 + 作用域后的 highlight.js 样式）直接嵌入 `<style>` 标签，置于 `<head>` 内。
  - 页面元素不再被写入内联 `style` 属性，方便获取完整 `innerHTML` 时样式不丢失。

### 影响
- 默认仍保持 `--inline` 为开启状态，兼顾复制友好与视觉一致性。
- 而`--no-inline`模式下不再需要复制相关 css 文件了。

### 代码位置
- 主要改动位于 `src/commands/convert/worker.js` 中的 `generateFullHtml` 函数及其调用链。