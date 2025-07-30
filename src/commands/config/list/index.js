export default {
  name: 'list',
  cmdName: 'list',
  alias: 'ls',
  description: 'List all configuration settings',
  run: async (...args) => {
    const worker = await import('./worker.js');
    worker.run(...args);
  }
};