export default {
  cmdName: 'list',
  alias: 'ls',
  description: 'List all available themes',
  options: [],
  run: async (command, options) => {
    const { run } = await import('./worker.js');
    await run(command, options);
  }
};