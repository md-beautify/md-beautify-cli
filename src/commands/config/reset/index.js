export default {
  name: 'reset',
  cmdName: 'reset',
  description: 'Reset configuration to defaults',
  options: [
    ['-f, --force', 'Force reset without confirmation', false]
  ],
  run: async (...args) => {
    const worker = await import('./worker.js');
    worker.run(...args);
  }
};