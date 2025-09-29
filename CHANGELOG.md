# Changelog

## v1.0.5 - 2025-09-29
## v1.0.4 - 2025-09-28

### 修复
- 修复发布NPM包后，代码块样式丢失的问题

## v1.0.3 - 2025-09-27

### 改进
- 优化样式转换，确保所有 CSS 规则都能正确应用，避免样式丢失或冲突。
- 修改 DEFAULT_CONFIG 中 inline 为 true，默认开启内联模式

## v1.0.2 - 2025-09-26

### 新增
- **富文本复制功能**：
  - 将复制按钮标题从"复制完整页面HTML"改为"复制富文本内容"
  - 使用 `navigator.clipboard.write()` 和 `ClipboardItem` 对象实现富文本复制
  - 复制成功提示更新为"已复制富文本到剪贴板"
  - 保留对不支持 `write` 方法浏览器的降级处理（降级到 `writeText` 或传统复制方法）
  - 复制内容存储在 `<script id="mb-copy-source">` 标签中，确保复制的是原始渲染内容
  - 采用 `text/html` MIME 类型，粘贴到富文本编辑器时可保持格式

### 改进
- **内联模式（--inline）**：
  - 使用 `juice.inlineContent` 将 CSS 规则下沉为元素的 `style` 属性，同时保留 `<style>` 标签本身。
  - 启用 `preservePseudos`、`preserveMediaQueries`、`preserveFontFaces`、`preserveKeyFrames` 等选项，确保伪元素、媒体查询、字体与关键帧继续生效。
  - 复制单节点时，可完整保留样式；页面渲染时，伪元素与复杂选择器依旧正常工作。

- **非内联模式（--no-inline）**：
  - 不再生成 `<link rel="stylesheet">` 外链，也不再复制 CSS 文件到输出目录。
  - 统一将合并后的 CSS（主题 + 作用域后的 highlight.js 样式）直接嵌入 `<style>` 标签，置于 `<head>` 内。
  - 页面元素不再被写入内联 `style` 属性，方便获取完整 `innerHTML` 时样式不丢失。

### 影响（针对改进部分）
- 默认仍保持 `--inline` 为开启状态，兼顾复制友好与视觉一致性。
- 而`--no-inline`模式下不再需要复制相关 css 文件了。

### 代码位置
（针对改进部分）
- 主要改动位于 `src/commands/convert/worker.js` 中的 `generateFullHtml` 函数及其调用链。

（富文本复制功能）
- 主要涉及 `src/commands/convert/worker.js` 中的 `injectToolbar` 函数，包括按钮标题、复制逻辑和提示信息的更新。