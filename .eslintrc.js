module.exports = {
  root: true,
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ['apps/*/']
    }
  },
  ignorePatterns: ['**/.eslintrc.js', '**/*.cy.ts', '**/commands.ts']
};
