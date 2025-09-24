export default {
  cmdName: 'current',
  description: 'Show the currently active theme',
  options: [],
  run: async (command, options) => {
    const { run } = await import('./worker.js');
    await run(command, options);
  }
};