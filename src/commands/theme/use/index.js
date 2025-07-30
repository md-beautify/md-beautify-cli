export default {
  cmdName: 'use',
  description: 'Set the default theme',
  options: [],
  run: async (command, options) => {
    const { run } = await import('./worker.js');
    await run(command, options);
  }
};