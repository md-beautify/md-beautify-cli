export default {
  name: 'get',
  cmdName: 'get <key>',
  description: 'Get a configuration value',
  run: async (...args) => {
    const worker = await import('./worker.js');
    worker.run(...args);
  }
};