# MD Beautify

一个强大的 Markdown 转 HTML 工具，专为生成美观的内联样式 HTML 而设计，方便复制到各种平台发布。

## ✨ 特性

- 🎨 **美观样式**: 内置精美的 CSS 样式，支持多种主题
- 📋 **内联样式**: 生成包含内联样式的 HTML，方便复制到微信公众号、知乎、掘金等平台
- 🚀 **批量处理**: 支持通配符批量转换多个文件
- 👀 **实时监听**: 支持文件变化监听，自动重新转换
- ⚙️ **配置管理**: 灵活的配置系统，支持个性化设置
- 🎯 **命令行友好**: 现代化的 CLI 界面，操作简单直观

> 支持**批量**处理是我们一大亮点，你可以一次转换多个文件，提高效率。

## 📦 安装

```bash
# 全局安装
npm install -g md-beautify

# 或者本地安装
npm install md-beautify
```

## 🚀 快速开始

### 基础用法

```bash
# 转换单个文件
md-beautify convert input.md

# 指定输出文件
md-beautify convert input.md -o output.html

# 生成内联样式（推荐用于平台发布）
md-beautify convert input.md --inline

# 转换后直接复制到剪贴板
md-beautify convert input.md --inline --copy
```

### 批量处理

```bash
# 转换当前目录所有 .md 文件
md-beautify convert *.md

# 转换到指定目录
md-beautify convert *.md -d output/

# 递归转换子目录
md-beautify convert **/*.md -d output/
```

### 实时监听

```bash
# 监听文件变化，自动转换
md-beautify convert input.md --watch

# 监听并生成内联样式
md-beautify convert input.md -w -i
```

## 📖 命令详解

### convert (c) - 转换命令

主要的转换功能命令。

```bash
md-beautify convert <input> [options]
md-beautify c <input> [options]  # 简写
```

**选项:**
- `-o, --output <file>` - 指定输出文件路径
- `-t, --theme <theme>` - 选择主题 (github, default, custom)
- `-i, --inline` - 生成内联样式
- `-c, --copy` - 复制结果到剪贴板
- `-w, --watch` - 监听文件变化
- `-d, --output-dir <dir>` - 批量转换的输出目录
- `--no-timestamp` - 不在文件名中添加时间戳
- `--config <config>` - 指定配置文件路径

**示例:**
```bash
# 基础转换
md-beautify convert README.md

# 生成内联样式并复制
md-beautify c README.md -i -c

# 批量转换到指定目录
md-beautify c docs/*.md -d output/ -i

# 使用特定主题
md-beautify c README.md -t github -i

# 监听模式
md-beautify c README.md -w -i -c
```

### config (cfg) - 配置管理

管理全局配置设置。

```bash
# 查看所有配置
md-beautify config list
md-beautify cfg ls  # 简写

# 设置配置值
md-beautify config set theme github
md-beautify config set inline true

# 获取配置值
md-beautify config get theme

# 重置配置
md-beautify config reset
md-beautify config reset --force  # 强制重置
```

**可配置项:**
- `theme` - 默认主题
- `inline` - 是否默认生成内联样式
- `outputDir` - 默认输出目录
- `timestamp` - 是否添加时间戳
- `copyToClipboard` - 是否默认复制到剪贴板
- `autoOpen` - 是否自动打开生成的文件

### theme (t) - 主题管理

管理和预览主题。

```bash
# 列出可用主题
md-beautify theme list
md-beautify t ls  # 简写

# 设置默认主题
md-beautify theme use github

# 预览主题效果
md-beautify theme preview github
md-beautify theme preview github -o preview.html
```

## ⚙️ 配置文件

配置文件位于 `~/.md-beautify/config.json`，包含以下默认设置：

```json
{
  "theme": "default",
  "outputDir": null,
  "inline": false,
  "timestamp": true,
  "autoOpen": false,
  "watchMode": false,
  "customCss": null,
  "copyToClipboard": false
}
```

## 🎨 主题系统

### 内置主题

- `default` - 默认主题，适合通用场景
- `github` - GitHub 风格主题
- `wechat` - 微信公众号优化主题
- `zhihu` - 知乎专栏优化主题

### 自定义主题

你可以通过修改 CSS 文件来自定义主题：

1. 复制 `src/md-beautify.css` 作为基础
2. 修改样式
3. 通过 `--config` 参数指定自定义配置

## 📁 项目结构

```
md-beautify/
├── bin/                    # 可执行文件
│   └── cli.js             # CLI 入口文件
├── src/                   # 源代码
│   ├── commands/          # 命令处理模块
│   ├── utils/             # 工具函数
│   ├── beautify.cjs       # 核心转换逻辑
│   ├── index.cjs          # 主入口
│   ├── main.js            # 主程序
│   ├── md.mjs             # Markdown 处理
│   ├── md-beautify.css    # 默认样式
│   └── custom.css         # 自定义样式
├── examples/              # 示例文件
│   ├── demo.css           # 示例样式
│   └── markdown.md        # 示例 Markdown
├── tests/                 # 测试文件
│   ├── test-batch/        # 批量测试目录
│   ├── test-batch-output/ # 批量测试输出
│   ├── final-verification.mjs  # 最终验证脚本
│   └── *.html             # 各种测试输出文件
├── docs/                  # 文档
│   └── design.md          # 设计文档
├── temp/                  # 临时文件
│   ├── v2/                # 旧版本文件
│   └── *.html             # 临时输出文件
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 📋 使用场景

### 微信公众号发布

```bash
# 生成适合微信公众号的内联样式
md-beautify convert article.md -i -c -t wechat
# 然后直接粘贴到微信公众号编辑器
```

### 知乎文章发布

```bash
# 生成适合知乎的样式
md-beautify convert article.md -i -c -t zhihu
```

### 技术博客批量转换

```bash
# 批量转换博客文章
md-beautify convert posts/*.md -d dist/ -i -t github
```

### 文档实时预览

```bash
# 实时监听并预览
md-beautify convert README.md -w -o preview.html
```

## 🔧 开发

```bash
# 克隆项目
git clone https://github.com/your-username/md-beautify.git
cd md-beautify

# 安装依赖
npm install

# 开发测试
npm run dev

# 运行测试
npm run test:convert
npm run test:batch
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果你觉得这个工具有用，请给个 ⭐️ Star！

---

**提示**: 使用 `md-beautify --help` 查看完整的命令帮助信息。

---

## TODO

### 微信公众号主题 (wechat)
- **字体**: 更大的字号，适合手机阅读
- **颜色**: 偏暖色调，符合微信生态
- **间距**: 更大的行间距和段落间距
- **代码块**: 圆角设计，浅色背景
- **引用**: 左侧彩色边框，背景色区分

### 知乎主题 (zhihu)
- **字体**: 知乎官方字体栈
- **颜色**: 知乎蓝色主色调
- **布局**: 更紧凑的设计，适合桌面阅读
- **代码块**: 深色主题，符合程序员喜好
- **表格**: 简洁的边框设计

### GitHub 主题 (github)
- **字体**: GitHub 官方字体
- **颜色**: GitHub 的灰白色调
- **代码块**: GitHub 风格的代码高亮
- **表格**: GitHub 风格的斑马纹表格

> 支持配置化，如

```json
// ~/.md-beautify/config.json
{
  "theme": "github",
  "customStyles": {
    "fontSize": "16px",
    "primaryColor": "#007acc",
    "codeBackground": "#f6f8fa",
    "customCssPath": "~/my-custom.css"
  }
}
```

> cli 参数支持

```bash
# 使用自定义 CSS
md-beautify convert file.md --custom-css ./my-style.css

# 快速样式调整
md-beautify convert file.md --font-size 18px --primary-color "#ff6b6b"
```

近期
- 🔧 实现真正的主题差异化 CSS
- 📝 添加自定义样式配置支持
中期
- 🎨 开发专门的平台优化主题
- 🖼️ 添加图片处理和图床支持
- 📱 移动端适配优化
远期
- Web 界面的主题编辑器
- 🔄 多平台一键发布
- 📊 样式效果预览对比