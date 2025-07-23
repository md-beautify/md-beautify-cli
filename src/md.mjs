
import MarkdownIt from "markdown-it";
import markdownItDeflist from "markdown-it-deflist";
import markdownItImplicitFigures from "markdown-it-implicit-figures";
import markdownItTableOfContents from "markdown-it-table-of-contents";
import markdownItRuby from "markdown-it-ruby";
import markdownItImsize from "markdown-it-imsize";
// 
import markdownItContainer from "markdown-it-container";

// 修改导入语句，添加文件扩展名
import markdownItImageFlow from "./utils/markdown-it-imageflow.mjs";
import markdownItLiReplacer from "./utils/markdown-it-li.js";
import markdownItLinkfoot from "./utils/markdown-it-linkfoot.js";
import markdownItMath from "./utils/markdown-it-math.js";
import markdownItMultiquote from "./utils/markdown-it-multiquote.js";
import markdownItSpan from "./utils/markdown-it-span.js";
import markdownItTableContainer from "./utils/markdown-it-table-container.js";
import highlightjs from "./utils/langHighlight.js";

// 普通解析器，代码高亮用highlight
export const markdownParser = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang === undefined || lang === "") {
      lang = "bash";
    }
    // 加上custom则表示自定义样式，而非微信专属，避免被remove pre
    if (lang && highlightjs.getLanguage(lang)) {
      try {
        const formatted = highlightjs
          .highlight(lang, str, true)
          .value.replace(/\n/g, "<br/>") // 换行用br表示
          .replace(/\s/g, "&nbsp;") // 用nbsp替换空格
          .replace(/span&nbsp;/g, "span "); // span标签修复
        return '<pre class="custom"><code class="hljs">' + formatted + "</code></pre>";
      } catch (e) {
        console.log(e);
      }
    }
    return '<pre class="custom"><code class="hljs">' + markdownParser.utils.escapeHtml(str) + "</code></pre>";
  },
});

markdownParser
  .use(markdownItSpan) // 在标题标签中添加span
  .use(markdownItTableContainer) // 在表格外部添加容器
  .use(markdownItMath) // 数学公式
  .use(markdownItLinkfoot) // 修改脚注
  .use(markdownItTableOfContents, {
    transformLink: () => "",
    includeLevel: [2, 3],
    markerPattern: /^\[toc\]/im,
  }) // TOC仅支持二级和三级标题
  .use(markdownItRuby) // 注音符号
  .use(markdownItImplicitFigures, {figcaption: true}) // 图示
  .use(markdownItDeflist) // 定义列表
  .use(markdownItLiReplacer) // li 标签中加入 p 标签
  .use(markdownItImageFlow) // 横屏移动插件
  .use(markdownItMultiquote) // 给多级引用加 class
  .use(markdownItImsize);

// 修改 markdownParser 的 blockquote 渲染规则，添加自定义类名
const defaultBlockquoteRender = markdownParser.renderer.rules.blockquote_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

markdownParser.renderer.rules.blockquote_open = function(tokens, idx, options, env, self) {
  // 添加自定义类名
  tokens[idx].attrJoin('class', 'custom-blockquote');
  return defaultBlockquoteRender(tokens, idx, options, env, self);
};

  
// 添加列布局容器
// markdownParser.use(markdownItContainer, 'column');
// markdownParser.use(markdownItContainer, 'column-left');
// markdownParser.use(markdownItContainer, 'column-right');
// 修改容器配置部分
['column', 'column-left', 'column-right'].forEach(type => {
  markdownParser.use(markdownItContainer, type, {
    validate: function(params) {
      return params.trim().split(' ')[0] === type;
    },
    render: function(tokens, idx) {
      const token = tokens[idx];
      const params = token.info.trim().split(/\s+/);
      const width = params[1] || (type === 'column-left' ? '50%' : '50%');

      if (token.nesting === 1) {
        if (type === 'column') {
          return `<div class="column-container" style="display:flex;">\n`;
        }
        // 支持任意有效百分比参数
        return `<div class="${type}" style="flex-basis: ${width.includes('%') ? width : width + '%'}">\n`;
      } else {
        return `</div>\n`;
      }
    }
  });
});
