# Tutors NPM Publisher

Command-line tool for publishing Tutors packages to NPM registry. This tool is part of the Tutors toolkit and handles the NPM package management aspects of the platform.

## Installation

```bash
npm install -g tutors-publish-npm
```

## Features

- Automated NPM package publishing
- Version management
- Package dependency handling
- Distribution file generation
- TypeScript compilation support

## Usage

```bash
tutors-publish-npm
```

The tool will:
1. Build the TypeScript source
2. Generate distribution files
3. Update package versions as needed
4. Publish to NPM registry

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run in development: `npm run dev`

## Package Structure

- `src/`: TypeScript source files
- `dist/`: Compiled JavaScript output
- `package.json`: NPM package configuration
- `tsconfig.json`: TypeScript configuration

## License

ISC

This tool is part of the [Tutors Platform](https://tutors.dev), an open learning web toolkit.
