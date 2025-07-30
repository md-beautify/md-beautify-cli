export default {
  name: 'set',
  cmdName: 'set <key> <value>',
  description: 'Set a configuration value',
  run: async (...args) => {
    const worker = await import('./worker.js');
    worker.run(...args);
  }
};