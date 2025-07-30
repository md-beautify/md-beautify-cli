export default {
  cmdName: 'preview',
  description: 'Preview a theme with sample content',
  options: [
    ['-o, --output <file>', 'Output file for preview (default: theme-preview.html)']
  ],
  run: async (command, options) => {
    const { run } = await import('./worker.js');
    await run(command, options);
  }
};