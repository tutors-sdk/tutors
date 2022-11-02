module.exports = {
  root: true,
  extends: [],
  settings: {
    next: {
      rootDir: ['apps/*/']
    }
  },
  ignorePatterns: ['**/.eslintrc.js', '**/*.cy.ts', '**/commands.ts']
};
