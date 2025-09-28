/**
 * 转换命令定义
 * examples: [
 *   'md-beautify convert input.md',
 *   'md-beautify convert input.md -o output.html',
 *   'md-beautify convert *.md',
 *   'md-beautify convert input.md --theme github',
 *   'md-beautify convert input.md --inline',
 *   'md-beautify convert input.md --copy',
 *   'md-beautify c input.md -o output.html -t github -i',
 * ]
 */
export default {
  name: 'convert',
  cmdName: 'convert <input>',
  alias: 'c',
  description: 'Convert markdown file(s) to beautiful HTML',
  options: [
    ['-o, --output <output>', 'Output file path (default: same name with .html extension)'],
    ['-t, --theme <theme>', 'Theme name (github, default, custom)', 'default'],
    ['-inline, --inline', 'Generate HTML with inline styles for easy copying'],
    ['--no-inline', 'Generate HTML with external CSS files or styles tags'],
    ['-c, --copy', 'Copy result to clipboard', false],
    ['-w, --watch', 'Watch file changes and auto-convert', false],
    ['-d, --output-dir <dir>', 'Output directory for batch conversion'],
    ['--no-timestamp', 'Do not add timestamp to output filename'],
    ['--config <config>', 'Path to config file'],
  ],
  run: async (...args) => {
    const worker = await import('./worker.js');
    worker.run(...args);
  }
};